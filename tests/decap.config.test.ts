import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'
import { numericValue, recordToRows, rowsToRecord } from '../public/admin/catalog-utils.js'
import { productCategoryKeys } from '../types/catalog'

const root = new URL('../', import.meta.url)
const config = parse(readFileSync(new URL('public/admin/config.yml', root), 'utf8'))

interface Field {
  name: string
  widget: string
  default?: unknown
  fields?: Field[]
}

function expectFieldsCoverData(fields: Field[], data: Record<string, unknown>) {
  for (const [name, value] of Object.entries(data)) {
    const field = fields.find(field => field.name === name)
    expect(field, `Missing CMS field: ${name}`).toBeDefined()
    if (field?.fields && Array.isArray(value)) {
      for (const row of value)
        expectFieldsCoverData(field.fields, row)
    }
  }
}

describe('decap CMS configuration', () => {
  it('uses Russian UI, GitHub main and isolated local editing', () => {
    expect(config.locale).toBe('ru')
    expect(config.backend).toMatchObject({
      name: 'github',
      repo: 'BlackFxTalon/interno-nuxt',
      branch: 'main',
      auth_endpoint: 'auth',
    })
    expect(config.backend.base_url).toMatch(/^https:\/\//)
    expect(config.local_backend).toEqual({ url: 'http://localhost:8081/api/v1' })
    expect(config.publish_mode).toBe('simple')
    expect(config.media_folder).toBe('public/images/uploads')
    expect(config.public_folder).toBe('/images/uploads')
  })

  it('covers every existing product field without changing category or record shapes', () => {
    const slugs = new Set<string>()
    for (const category of productCategoryKeys) {
      const collection = config.collections.find((item: { name: string }) => item.name === category)
      expect(collection).toMatchObject({
        folder: `content/products/${category}`,
        format: 'json',
        extension: 'json',
        identifier_field: 'name',
        slug: '{{fields.slug}}',
        create: true,
      })
      expect(collection.fields.find((field: Field) => field.name === 'category'))
        .toMatchObject({ widget: 'hidden', default: category })
      for (const name of ['prices', 'weights']) {
        expect(collection.fields.find((field: Field) => field.name === name)?.widget).toBe('size-record')
      }
      const folder = new URL(`${collection.folder}/`, root)
      for (const filename of readdirSync(folder)) {
        const product = JSON.parse(readFileSync(new URL(filename, folder), 'utf8'))
        expectFieldsCoverData(collection.fields, product)
        expect(product.category).toBe(category)
        expect(slugs.has(product.slug), `Duplicate slug: ${product.slug}`).toBe(false)
        slugs.add(product.slug)
        for (const name of ['prices', 'weights']) {
          if (product[name])
            expect(rowsToRecord(recordToRows(product[name]))).toEqual(product[name])
        }
      }
    }
    expect(slugs.size).toBeGreaterThan(0)
  })

  it('covers all pages, navigation and hero fields', () => {
    const pages = config.collections.find((item: { name: string }) => item.name === 'pages')
    expect(pages.files.map((file: { name: string }) => file.name).sort())
      .toEqual(['about', 'faq', 'policy', 'returns'])
    for (const file of pages.files) {
      const markdown = readFileSync(new URL(file.file, root), 'utf8')
      const frontmatter = markdown.split('---')[1]
      expect(frontmatter).toBeDefined()
      if (frontmatter === undefined)
        throw new Error(`Missing frontmatter in ${file.file}`)
      expectFieldsCoverData(file.fields, parse(frontmatter))
      expect(file.fields.find((field: Field) => field.name === 'body')?.widget).toBe('markdown')
    }
    const settings = config.collections.find((item: { name: string }) => item.name === 'settings')
    for (const file of settings.files) {
      const data = JSON.parse(readFileSync(new URL(file.file, root), 'utf8'))
      expectFieldsCoverData(file.fields, data)
    }
  })

  it('serves a standalone admin without Studio, and bypasses PWA precaching', () => {
    const html = readFileSync(new URL('public/admin/index.html', root), 'utf8')
    expect(html).toContain('lang="ru"')
    expect(html).toContain('noindex, nofollow')
    expect(html).toContain('window.CMS_MANUAL_INIT = true')
    expect(html).toContain('decap-cms@3.16.3')
    for (const file of ['config.yml', 'cms.js', 'catalog-utils.js', 'admin.css'])
      expect(readFileSync(new URL(join('public/admin', file), root), 'utf8').length).toBeGreaterThan(0)
    const nuxtConfig = readFileSync(new URL('nuxt.config.ts', root), 'utf8')
    expect(nuxtConfig).not.toContain('nuxt-studio')
    expect(nuxtConfig).toContain('\'admin/**\'')
    expect(nuxtConfig).toContain('navigateFallbackDenylist')
    const packageJson = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'))
    expect(packageJson.dependencies).not.toHaveProperty('nuxt-studio')
  })
})

describe('size-record widget data conversion', () => {
  it('keeps number/string values and decimal-comma weights when untouched', () => {
    const data = { '80×190': 23450, '60×40×15': '1,6', '90×200': '24070' }
    expect(rowsToRecord(recordToRows(data))).toEqual(data)
    expect(recordToRows({ toJS: () => data })).toEqual(recordToRows(data))
    expect(recordToRows(undefined)).toEqual([])
    expect(rowsToRecord([])).toEqual({})
  })

  it('accepts finite non-negative numbers, spaces and decimal commas', () => {
    expect(numericValue('23 450')).toBe(23450)
    expect(numericValue('1,6')).toBe(1.6)
    expect(numericValue('0')).toBe(0)
    expect(numericValue(25)).toBe(25)
    for (const value of ['', 'abc', -1, Number.NaN, Number.POSITIVE_INFINITY])
      expect(() => numericValue(value)).toThrow()
  })

  it('rejects blank, duplicate and unsafe keys instead of silently losing values', () => {
    expect(() => rowsToRecord([{ size: '', amount: 1 }])).toThrow('размер')
    expect(() => rowsToRecord([{ size: '80×190', amount: 1 }, { size: ' 80×190 ', amount: 2 }]))
      .toThrow('дважды')
    expect(() => rowsToRecord([{ size: '__proto__', amount: 1 }])).toThrow('Недопустимый')
    expect(() => rowsToRecord([{ size: '80×190', amount: 'abc' }])).toThrow()
    expect(() => recordToRows([])).toThrow()
  })
})
