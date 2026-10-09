import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const forms = [
  'InquiryFormModal',
  'OrderModal',
  'FindYourPerfectMatrassModal',
  'LimitedTimeOffer',
]

describe('application form requirements', () => {
  it.each(forms)('%s keeps email optional and name/phone required', (name) => {
    const source = readFileSync(new URL(`../components/${name}.vue`, import.meta.url), 'utf8')
    const inputs = [...source.matchAll(/<(?:UiInput|input)\b[^>]*>/g)].map(match => match[0])
    const email = inputs.filter(input => /v-model="[^"]+\.email"/.test(input))

    expect(email).toHaveLength(1)
    expect(email[0]).toContain('type="email"')
    expect(email[0]).not.toMatch(/\brequired\b/)
    expect(source).toContain('(необязательно)')

    for (const field of ['name', 'phone']) {
      const input = inputs.filter(input => input.includes(`.${field}"`))
      expect(input).toHaveLength(1)
      expect(input[0]).toMatch(/\brequired\b/)
    }
  })
})
