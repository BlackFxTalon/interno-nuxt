<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

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

  const accessKey = config.public.web3formsAccessKeyOne

  if (!accessKey) {
    submitStatus.value = 'error'
    errorMessage.value = 'Не настроен ключ доступа Web3Forms. Пожалуйста, добавьте NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY в переменные окружения.'
    isLoading.value = false
    return
  }

  try {
    const data = await $fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: {
        access_key: accessKey,
        subject: 'Новая заявка с сайта Интерно - Оформить заказ',
        name: inquiryForm.value.name,
        email: inquiryForm.value.email,
        phone: inquiryForm.value.phone,
        from_name: 'Интерно - Форма обратной связи',
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
    errorMessage.value = error?.data?.message || error?.message || 'Произошла ошибка. Попробуйте позже.'
  }
  finally {
    isLoading.value = false
  }
}

watch(showModal, (isOpen) => {
  updateBodyOverflow(isOpen)
  if (isOpen) {
    resetForm()
  }
})

onMounted(() => {
  if (showModal.value) {
    updateBodyOverflow(true)
  }
})

onUnmounted(() => {
  updateBodyOverflow(false)
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
  <SuccessModal
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
