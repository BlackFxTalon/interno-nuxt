import type { Ref } from 'vue'
import type { InquiryFormId } from '../utils/consent'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { CONSENT_VERSION } from '../utils/consent'
import { loadSmartCaptcha } from '../utils/smartcaptcha'

interface UseFormSubmitOptions {
  showModal?: Ref<boolean>
  captchaContainerId: string
  formId: InquiryFormId
  successModal?: { title: string, message: string }
}

interface FormData {
  name: string
  email: string
  phone: string
}

interface ApiResponse {
  success: boolean
  message?: string
  requestId?: string
}

export function useFormSubmit(options: UseFormSubmitOptions) {
  const { showModal, captchaContainerId, formId, successModal = { title: '', message: '' } } = options
  const config = useRuntimeConfig()
  const { showSuccessModal } = useSuccessModal()
  const { isLoading, setLoading } = useLoader()
  const submitStatus = ref('idle')
  const errorMessage = ref('')
  const captchaToken = ref('')
  const captchaWidgetId = ref<number | null>(null)
  const consentGiven = ref(false)

  function resetFormState() {
    submitStatus.value = 'idle'
    errorMessage.value = ''
    captchaToken.value = ''
    consentGiven.value = false
  }

  function updateBodyOverflow(isOpen: boolean) {
    if (import.meta.client && document.body)
      document.body.style.overflow = isOpen ? 'hidden' : ''
  }

  async function initCaptcha() {
    if (!import.meta.client || !consentGiven.value || captchaWidgetId.value !== null)
      return
    try {
      await loadSmartCaptcha()
      await nextTick()
      // Consent may be withdrawn or the modal closed while the script loads.
      if (!consentGiven.value || (showModal && !showModal.value) || captchaWidgetId.value !== null)
        return
      const container = document.getElementById(captchaContainerId)
      if (container && window.smartCaptcha) {
        captchaWidgetId.value = window.smartCaptcha.render(container, {
          sitekey: config.public.smartcaptchaClientKey,
          hl: 'ru',
          callback: (token) => {
            if (!consentGiven.value)
              return
            captchaToken.value = token
            errorMessage.value = ''
            submitStatus.value = 'idle'
          },
        })
      }
    }
    catch {
      if (consentGiven.value) {
        errorMessage.value = 'Не удалось загрузить проверку от спама. Обновите страницу и попробуйте снова.'
        submitStatus.value = 'error'
      }
    }
  }

  function destroyCaptcha() {
    if (import.meta.client && window.smartCaptcha && captchaWidgetId.value !== null) {
      try {
        window.smartCaptcha.destroy(captchaWidgetId.value)
      }
      catch {
        // The widget may already be gone when a modal is unmounted.
      }
      finally {
        captchaWidgetId.value = null
      }
    }
    captchaToken.value = ''
  }

  async function submitForm(formData: FormData, additionalData: Record<string, unknown> = {}) {
    if (!consentGiven.value) {
      errorMessage.value = 'Для отправки заявки необходимо отдельное согласие на обработку персональных данных.'
      submitStatus.value = 'error'
      return false
    }
    if (!captchaToken.value) {
      errorMessage.value = 'Пожалуйста, подтвердите, что вы не робот'
      submitStatus.value = 'error'
      return false
    }

    setLoading(true)
    submitStatus.value = 'idle'
    errorMessage.value = ''
    try {
      const data = await $fetch<ApiResponse>('/api/send-email', {
        method: 'POST',
        // Canonical security fields cannot be overridden by additional data.
        body: {
          ...additionalData,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          captchaToken: captchaToken.value,
          formId,
          consent: { accepted: true, version: CONSENT_VERSION },
        },
      })
      if (!data.success)
        throw new Error(data.message || 'Ошибка отправки заявки')
      resetFormState()
      if (showModal)
        showModal.value = false
      const receiptId = data.requestId && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.requestId) ? data.requestId : ''
      const notice = receiptId
        ? { ...successModal, message: `${successModal.message} Номер заявки: ${receiptId}.` }
        : successModal
      setTimeout(showSuccessModal, 100, notice)
      return true
    }
    catch (error) {
      submitStatus.value = 'error'
      const message = (error as { data?: { message?: unknown } })?.data?.message
      errorMessage.value = typeof message === 'string' && message.length <= 300
        ? message
        : 'Произошла ошибка. Попробуйте позже.'
      // CAPTCHA tokens are single-use: retries require a new challenge.
      destroyCaptcha()
      await initCaptcha()
      return false
    }
    finally {
      setLoading(false)
    }
  }

  watch(consentGiven, async (accepted) => {
    if (accepted)
      await initCaptcha()
    else
      destroyCaptcha()
  })

  if (showModal) {
    watch(showModal, (isOpen) => {
      updateBodyOverflow(isOpen)
      resetFormState()
      if (!isOpen)
        destroyCaptcha()
    })
    onMounted(() => updateBodyOverflow(showModal.value))
    onUnmounted(() => {
      updateBodyOverflow(false)
      destroyCaptcha()
    })
  }

  return {
    isLoading,
    submitStatus,
    errorMessage,
    captchaToken,
    consentGiven,
    resetFormState,
    submitForm,
    initCaptcha,
    destroyCaptcha,
    updateBodyOverflow,
  }
}
