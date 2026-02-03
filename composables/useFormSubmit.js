import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

/**
 * Composable для обработки отправки формы с капчей
 * @param {object} options - Опции конфигурации
 * @param {import('vue').Ref} options.showModal - Ref для отображения модального окна
 * @param {string} options.captchaContainerId - ID контейнера для капчи
 * @param {object} [options.successModal] - Настройки модального окна успеха
 * @param {string} [options.successModal.title] - Заголовок модального окна успеха
 * @param {string} [options.successModal.message] - Сообщение модального окна успеха
 * @returns {object} Объект с методами и состояниями формы
 */
export function useFormSubmit(options = {}) {
  const { showModal, captchaContainerId = 'captcha-container', successModal = {} } = options

  const config = useRuntimeConfig()
  // eslint-disable-next-line no-undef
  const { showSuccessModal } = useSuccessModal()
  // eslint-disable-next-line no-undef
  const { isLoading, setLoading } = useLoader()

  // Состояния
  const submitStatus = ref('idle')
  const errorMessage = ref('')
  const captchaToken = ref('')
  const captchaWidgetId = ref(null)

  /**
   * Сброс формы к начальному состоянию
   */
  function resetFormState() {
    submitStatus.value = 'idle'
    errorMessage.value = ''
    captchaToken.value = ''
  }

  /**
   * Управление overflow body для модального окна
   */
  function updateBodyOverflow(isOpen) {
    if (import.meta.client && document?.body) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  }

  /**
   * Callback для успешной проверки капчи
   */
  function onCaptchaSuccess(token) {
    captchaToken.value = token
    errorMessage.value = ''
    submitStatus.value = 'idle'
  }

  /**
   * Инициализация виджета SmartCaptcha
   */
  function initCaptcha() {
    if (import.meta.client && window.smartCaptcha) {
      const container = document.getElementById(captchaContainerId)
      if (container && !captchaWidgetId.value) {
        try {
          captchaWidgetId.value = window.smartCaptcha.render(container, {
            sitekey: config.public.smartcaptchaClientKey,
            hl: 'ru',
            callback: onCaptchaSuccess,
          })
        }
        catch (error) {
          console.error('Ошибка инициализации капчи:', error)
        }
      }
    }
  }

  /**
   * Уничтожение виджета SmartCaptcha
   */
  function destroyCaptcha() {
    if (import.meta.client && window.smartCaptcha && captchaWidgetId.value !== null) {
      try {
        window.smartCaptcha.destroy(captchaWidgetId.value)
        captchaWidgetId.value = null
        captchaToken.value = ''
      }
      catch (error) {
        console.error('Ошибка уничтожения капчи:', error)
      }
    }
  }

  /**
   * Отправка формы на сервер
   * @param {object} formData - Данные формы
   * @param {string} formData.name - Имя
   * @param {string} formData.email - Email
   * @param {string} formData.phone - Телефон
   * @param {object} [additionalData] - Дополнительные данные для отправки (например, productData)
   * @returns {Promise<boolean>} Успешность отправки
   */
  async function submitForm(formData, additionalData = {}) {
    if (!captchaToken.value) {
      errorMessage.value = 'Пожалуйста, подтвердите, что вы не робот'
      submitStatus.value = 'error'
      return false
    }

    setLoading(true)
    submitStatus.value = 'idle'
    errorMessage.value = ''

    try {
      const data = await $fetch('/api/send-email', {
        method: 'POST',
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          captchaToken: captchaToken.value,
          ...additionalData,
        },
      })

      if (data.success) {
        resetFormState()
        // Закрываем форму если передан showModal
        if (showModal) {
          showModal.value = false
        }
        // Небольшая задержка для плавного перехода
        setTimeout(() => {
          showSuccessModal(successModal)
        }, 100)
        return true
      }
      else {
        throw new Error(data.message || 'Ошибка при отправке формы')
      }
    }
    catch (error) {
      submitStatus.value = 'error'
      errorMessage.value = 'Произошла ошибка. Попробуйте позже.'
      console.error(error?.data?.message || error?.message)
      return false
    }
    finally {
      setLoading(false)
    }
  }

  // Настройка watchers и lifecycle hooks если передан showModal
  if (showModal) {
    watch(showModal, async (isOpen) => {
      updateBodyOverflow(isOpen)
      if (isOpen) {
        resetFormState()
        await nextTick()
        // Даем время на загрузку скрипта, если он еще не загружен
        setTimeout(() => {
          initCaptcha()
        }, 100)
      }
      else {
        destroyCaptcha()
      }
    })

    onMounted(() => {
      if (showModal.value) {
        updateBodyOverflow(true)
        nextTick(() => {
          setTimeout(() => {
            initCaptcha()
          }, 100)
        })
      }
    })

    onUnmounted(() => {
      updateBodyOverflow(false)
      destroyCaptcha()
    })
  }

  return {
    // Состояния
    isLoading,
    submitStatus,
    errorMessage,
    captchaToken,

    // Методы
    resetFormState,
    submitForm,
    initCaptcha,
    destroyCaptcha,
    updateBodyOverflow,
  }
}
