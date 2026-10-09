import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useFormSubmit } from '../composables/useFormSubmit'
import { CONSENT_VERSION } from '../utils/consent'

const fetchMock = vi.fn()
const loadingMock = vi.fn()
const successMock = vi.fn()
const values = { name: 'Тест', phone: '+70000000000', email: '' }

beforeEach(() => {
  vi.useFakeTimers()
  vi.clearAllMocks()
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { smartcaptchaClientKey: 'test-public-key' } }))
  vi.stubGlobal('useSuccessModal', () => ({ showSuccessModal: successMock }))
  vi.stubGlobal('useLoader', () => ({ isLoading: ref(false), setLoading: loadingMock }))
  vi.stubGlobal('$fetch', fetchMock)
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function form() {
  return useFormSubmit({ captchaContainerId: 'isolated-test', formId: 'inquiry' })
}

describe('submission consent guard', () => {
  it('starts unchecked and prevents submission even with a CAPTCHA token', async () => {
    const state = form()
    state.captchaToken.value = 'test-token'
    expect(state.consentGiven.value).toBe(false)
    expect(await state.submitForm(values)).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(loadingMock).not.toHaveBeenCalled()
    expect(state.errorMessage.value).toContain('отдельное согласие')
  })

  it('requires CAPTCHA after consent', async () => {
    const state = form()
    state.consentGiven.value = true
    expect(await state.submitForm(values)).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends the current consent without allowing security-field overrides, then resets it', async () => {
    const state = form()
    state.consentGiven.value = true
    state.captchaToken.value = 'real-test-token'
    fetchMock.mockResolvedValueOnce({ success: true, requestId: 'test-id' })
    expect(await state.submitForm(values, { consent: { accepted: false }, formId: 'unknown', captchaToken: 'overridden', productData: { name: 'Товар' } })).toBe(true)
    expect(fetchMock.mock.calls[0]?.[1]?.body).toEqual({
      ...values,
      formId: 'inquiry',
      captchaToken: 'real-test-token',
      consent: { accepted: true, version: CONSENT_VERSION },
      productData: { name: 'Товар' },
    })
    expect(state.consentGiven.value).toBe(false)
    expect(state.captchaToken.value).toBe('')
    vi.runAllTimers()
    expect(successMock).toHaveBeenCalledOnce()
  })

  it('shows a safe server error and invalidates a spent CAPTCHA token', async () => {
    const state = form()
    state.consentGiven.value = true
    state.captchaToken.value = 'test-token'
    fetchMock.mockRejectedValueOnce({ data: { message: 'Обновите страницу' } })
    expect(await state.submitForm(values)).toBe(false)
    expect(state.errorMessage.value).toBe('Обновите страницу')
    expect(state.captchaToken.value).toBe('')
    expect(successMock).not.toHaveBeenCalled()
  })
})
