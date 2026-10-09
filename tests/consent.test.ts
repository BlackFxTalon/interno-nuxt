import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { CONSENT_DOCUMENT_PATH, CONSENT_VERSION, inquiryFormIds } from '../utils/consent'

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

describe('versioned personal-data consent', () => {
  it('matches the backend version, document URL and immutable source hash', () => {
    const policy = JSON.parse(read('services/email/consent-policy.json'))
    expect(policy.version).toBe(CONSENT_VERSION)
    expect(policy.documentPath).toBe(CONSENT_DOCUMENT_PATH)
    expect(policy.documentSha256).toBe(createHash('sha256').update(read(`content/pages/consent/${CONSENT_VERSION}.md`).replace(/\r\n/g, '\n')).digest('hex'))
    expect(policy.retentionDays).toBe(90)
    expect(policy.formIds).toEqual(inquiryFormIds)
    expect(existsSync(new URL(`../pages/consent/${CONSENT_VERSION}.vue`, import.meta.url))).toBe(true)
  })

  it('offers an unchecked required checkbox and separate links, without marketing consent', () => {
    const source = read('components/PersonalDataConsent.vue')
    expect(source).toContain('default: false')
    expect(source).toContain('type="checkbox"')
    expect(source).toMatch(/\brequired\b/)
    expect(source).not.toMatch(/\bchecked\s*[=>]/)
    expect(source).toContain('CONSENT_DOCUMENT_PATH')
    expect(source).toContain('to="/policy"')
    expect(source).toContain('не согласие на рекламную рассылку')
  })

  it.each(['InquiryFormModal', 'OrderModal', 'FindYourPerfectMatrassModal', 'LimitedTimeOffer'])('%s uses the common consent and submission flow', (name) => {
    const source = read(`components/${name}.vue`)
    expect(source).toContain('<PersonalDataConsent')
    expect(source).toContain('v-model="consentGiven"')
    expect(source).toContain('useFormSubmit(')
    expect(source).toContain('formId:')
  })

  it('does not load Google Fonts or global CAPTCHA, or cache API responses', () => {
    const config = read('nuxt.config.ts')
    expect(config).not.toContain('fonts.googleapis')
    expect(config).not.toContain('smartcaptcha.cloud')
    expect(config).not.toContain('cacheName: \'interno-api\'')
    expect(config).not.toContain('cookieControl:')
    expect(config).toContain('importScripts: [\'/sw-privacy-cleanup.js\']')
    expect(read('public/sw-privacy-cleanup.js')).toContain('name === \'interno-api\'')
    expect(read('assets/css/fonts.css')).toContain('@fontsource-variable/inter')
  })
})
