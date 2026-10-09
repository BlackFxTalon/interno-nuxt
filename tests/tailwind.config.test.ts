import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from 'tailwindcss'
import { describe, expect, it } from 'vitest'

const root = fileURLToPath(new URL('../', import.meta.url))
const require = createRequire(import.meta.url)
const stylesheet = join(root, 'assets/css/tailwind.css')

async function loadStylesheet(id: string, base: string) {
  const path = id.startsWith('.') ? resolve(base, id) : require.resolve(id === 'tailwindcss' ? 'tailwindcss/index.css' : id)
  return { path, base: dirname(path), content: readFileSync(path, 'utf8') }
}

function vueFiles(folder: string): string[] {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name)
    return entry.isDirectory() ? vueFiles(path) : entry.name.endsWith('.vue') ? [path] : []
  })
}

const components = [
  join(root, 'app.vue'),
  ...vueFiles(join(root, 'components')),
  ...vueFiles(join(root, 'layouts')),
  ...vueFiles(join(root, 'pages')),
]

describe('tailwind 4 integration', () => {
  it('compiles the brand theme, opacity modifiers and responsive utilities', async () => {
    const compiler = await compile(readFileSync(stylesheet, 'utf8'), {
      base: dirname(stylesheet),
      loadStylesheet,
    })
    const css = compiler.build(['bg-primary/60', 'text-primary', 'font-inter', 'md:grid-cols-2', 'bg-black/50'])

    expect(css).toContain('--color-primary: #0580c7')
    expect(css).toContain('font-family: var(--font-inter)')
    expect(css).toContain('.bg-primary\\/60')
    expect(css).toContain('.bg-black\\/50')
    expect(css).toContain('@media (width >= 48rem)')
    expect(compiler.root).toBe('none')
    expect(compiler.sources.map(source => resolve(source.base, source.pattern)))
      .toEqual(['app.vue', 'components', 'layouts', 'pages'].map(path => join(root, path)))
  })

  it('compiles every Vue @apply block without duplicating global Tailwind CSS', async () => {
    let compiledBlocks = 0
    for (const path of components) {
      const source = readFileSync(path, 'utf8')
      expect(source, path).not.toMatch(/<style[^>]*lang=["']scss["']/)
      const styles = source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)
      for (const match of styles) {
        const style = match[1]
        if (!style?.includes('@apply'))
          continue
        expect(style, path).toContain('@reference')
        const compiler = await compile(style, { base: dirname(path), loadStylesheet })
        const css = compiler.build([])
        expect(css, path).not.toMatch(/@apply|@reference|@import/)
        expect(css, path).not.toContain('box-sizing: border-box')
        expect(css, path).not.toContain('--color-primary:')
        compiledBlocks++
      }
    }
    expect(compiledBlocks).toBeGreaterThan(0)
  })

  it('does not retain the v3 module, config or deprecated application utilities', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    expect(pkg.dependencies).not.toHaveProperty('@nuxtjs/tailwindcss')
    expect(pkg.devDependencies.tailwindcss).toMatch(/^\^4\./)
    expect(pkg.devDependencies).toHaveProperty('@tailwindcss/vite')
    expect(existsSync(join(root, 'tailwind.config.ts'))).toBe(false)

    for (const path of components) {
      const source = readFileSync(path, 'utf8')
      expect(source, path).not.toMatch(/\b(?:bg|text|border|ring|divide|placeholder)-opacity-\d+\b/)
      expect(source, path).not.toMatch(/\bflex-(?:shrink|grow)-\d+\b|\bbg-gradient-to-|\boutline-none\b|\bplaceholder-gray-/)
    }
  })
})
