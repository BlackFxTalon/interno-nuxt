<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const showModal = defineModel('showModal', { default: false })
const config = useRuntimeConfig()

const inquiryForm = ref({
  name: '',
  email: '',
  phone: '',
})

const isLoading = ref(false)
const submitStatus = ref('idle')
const errorMessage = ref('')
const showSuccessModal = ref(false)
const captchaToken = ref('')
const captchaWidgetId = ref(null)

function resetForm() {
  inquiryForm.value = {
    name: '',
    email: '',
    phone: '',
  }
  submitStatus.value = 'idle'
  errorMessage.value = ''
}

function updateBodyOverflow(isOpen) {
  if (import.meta.client && document?.body) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
}

async function submitInquiry() {
  isLoading.value = true
  submitStatus.value = 'idle'
  errorMessage.value = ''

  try {
    const data = await $fetch('/api/send-email', {
      method: 'POST',
      body: {
        name: inquiryForm.value.name,
        email: inquiryForm.value.email,
        phone: inquiryForm.value.phone,
      },
    })

    if (data.success) {
      resetForm()
      // Сначала закрываем форму, затем открываем модальное окно успеха
      showModal.value = false
      // Небольшая задержка для плавного перехода
      setTimeout(() => {
        showSuccessModal.value = true
      }, 100)
    }
    else {
      throw new Error(data.message || 'Ошибка при отправке формы')
    }
  }
  catch (error) {
    submitStatus.value = 'error'
    errorMessage.value = 'Произошла ошибка. Попробуйте позже.'
    console.error(error?.data?.message || error?.message)
  }
  finally {
    isLoading.value = false
  }
}

// Callback для SmartCaptcha
function onCaptchaSuccess(token) {
  captchaToken.value = token
  errorMessage.value = ''
  submitStatus.value = 'idle'
}

// Инициализация капчи
function initCaptcha() {
  if (import.meta.client && window.smartCaptcha) {
    const container = document.getElementById('captcha-container')
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

// Уничтожение капчи
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

watch(showModal, async (isOpen) => {
  updateBodyOverflow(isOpen)
  if (isOpen) {
    resetForm()
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
</script>

<template>
  <Transition name="modal-backdrop">
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Transition name="modal">
        <div v-if="showModal" class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-semibold">
              Оформить заказ
            </h3>
            <button class="text-gray-500 hover:text-gray-700" @click="showModal = false">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form
            name="inquiry-form"
            class="space-y-6"
            @submit.prevent="submitInquiry"
          >
            <!-- Сообщение об ошибке -->
            <div
              v-if="submitStatus === 'error'"
              class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
            >
              <p class="font-medium">
                {{ errorMessage || 'Произошла ошибка. Попробуйте позже.' }}
              </p>
            </div>

            <div class="form-group">
              <UiLabel for="inquiryFormName">
                Имя
              </UiLabel>
              <UiInput
                id="inquiryFormName"
                v-model="inquiryForm.name"
                name="Имя"
                placeholder="Введите ваше имя"
                type="text"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="form-group">
              <UiLabel for="inquiryFormEmail">
                Email
              </UiLabel>
              <UiInput
                id="inquiryFormEmail"
                v-model="inquiryForm.email"
                name="email"
                placeholder="Введите вашу почту"
                type="email"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="form-group">
              <UiLabel for="inquiryFormPhone">
                Телефон
              </UiLabel>
              <UiInput
                id="inquiryFormPhone"
                v-model="inquiryForm.phone"
                v-maska="'+7(9##)###-##-##'"
                name="Телефон"
                placeholder="+7(9XX)XXX-XX-XX"
                required
                :disabled="isLoading"
              />
            </div>
            <ClientOnly>
              <div class="form-group">
                <div
                  id="captcha-container"
                  style="min-height: 100px"
                />
              </div>
            </ClientOnly>
            <UiButton
              type="submit"
              class="h-[48px]"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Отправка...</span>
              <span v-else>Отправить</span>
            </UiButton>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Модальное окно успеха -->
  <LazySuccessModal
    v-model:show="showSuccessModal"
    title="Спасибо!"
    message="Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время."
  />
</template>

<style lang="scss" scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary;
}

.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
