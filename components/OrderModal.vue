<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currentSize: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    default: null,
  },
  weight: {
    type: Number,
    default: null,
  },
  color: {
    type: String,
    default: null,
  },
  liftingMechanism: {
    type: String,
    default: null,
  },
  antivandalVelor: {
    type: String,
    default: null,
  },
  robotVacuumCleanerLegs: {
    type: String,
    default: null,
  },
})

const showOrderForm = defineModel({ default: false })
const config = useRuntimeConfig()

const orderForm = ref({
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
  orderForm.value = {
    name: '',
    email: '',
    phone: '',
  }
  submitStatus.value = 'idle'
  errorMessage.value = ''
  captchaToken.value = ''
}

function updateBodyOverflow(isOpen) {
  if (import.meta.client && document?.body) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
}

// Подготавливаем данные о товаре для отправки
function getProductData() {
  const productData = {
    name: props.name,
    price: props.price,
    currentSize: props.currentSize,
  }

  // Добавляем только те поля, которые имеют значения
  if (props.height !== null)
    productData.height = props.height
  if (props.weight !== null)
    productData.weight = props.weight
  if (props.color)
    productData.color = props.color
  if (props.liftingMechanism)
    productData.liftingMechanism = props.liftingMechanism
  if (props.antivandalVelor)
    productData.antivandalVelor = props.antivandalVelor
  if (props.robotVacuumCleanerLegs)
    productData.robotVacuumCleanerLegs = props.robotVacuumCleanerLegs

  return productData
}

async function submitOrder() {
  if (!captchaToken.value) {
    errorMessage.value = 'Пожалуйста, подтвердите, что вы не робот'
    submitStatus.value = 'error'
    return
  }

  isLoading.value = true
  submitStatus.value = 'idle'
  errorMessage.value = ''

  try {
    const productData = getProductData()

    const data = await $fetch('/api/send-email', {
      method: 'POST',
      body: {
        name: orderForm.value.name,
        email: orderForm.value.email,
        phone: orderForm.value.phone,
        captchaToken: captchaToken.value,
        productData, // Отправляем данные о товаре
      },
    })

    if (data.success) {
      resetForm()
      // Сначала закрываем форму, затем открываем модальное окно успеха
      showOrderForm.value = false
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
  console.log('Captcha success, token:', token)
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

watch(showOrderForm, async (isOpen) => {
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
  if (showOrderForm.value) {
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
  <div>
    <Transition name="modal-backdrop">
      <div v-if="showOrderForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Transition name="modal">
          <div v-if="showOrderForm" class="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-semibold">
                Оформление заказа
              </h3>
              <button class="text-gray-500 hover:text-gray-700" @click="showOrderForm = false">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
              <p class="text-base md:text-lg font-medium mb-2">
                {{ props.name }}
              </p>
              <div class="mt-3 text-sm md:text-base font-bold text-primary">
                {{ props.price }} ₽
              </div>
              <div class="text-sm md:text-base text-gray-600 space-y-1">
                <p v-if="props.currentSize">
                  <span class="font-semibold">Размер:</span> {{ props.currentSize }}
                </p>
                <p v-if="props.height">
                  <span class="font-semibold">Высота:</span> {{ props.height }} см
                </p>
                <p v-if="props.weight">
                  <span class="font-semibold">Вес:</span> {{ props.weight }} кг
                </p>
                <p v-if="props.color">
                  <span class="font-semibold">Цвет:</span> {{ props.color }}
                </p>
                <p v-if="props.liftingMechanism">
                  <span class="font-semibold">Подъемный механизм:</span> {{ props.liftingMechanism }}
                </p>
                <p v-if="props.antivandalVelor">
                  <span class="font-semibold">Антивандальный велюр:</span> {{ props.antivandalVelor }}
                </p>
                <p v-if="props.robotVacuumCleanerLegs">
                  <span class="font-semibold">Ножки под робот-пылесос (13 см):</span> {{ props.robotVacuumCleanerLegs }}
                </p>
              </div>
            </div>
            <form
              name="order-form"
              class="space-y-4"
              @submit.prevent="submitOrder"
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
                <UiLabel for="orderFormName">
                  Имя
                </UiLabel>
                <UiInput
                  id="orderFormName"
                  v-model="orderForm.name"
                  name="Имя"
                  placeholder="Введите ваше имя"
                  type="text"
                  required
                  :disabled="isLoading"
                />
              </div>
              <div class="form-group">
                <UiLabel for="orderFormEmail">
                  Email
                </UiLabel>
                <UiInput
                  id="orderFormEmail"
                  v-model="orderForm.email"
                  name="email"
                  placeholder="Введите вашу почту"
                  type="email"
                  required
                  :disabled="isLoading"
                />
              </div>
              <div class="form-group">
                <UiLabel for="orderFormPhone">
                  Телефон
                </UiLabel>
                <UiInput
                  id="orderFormPhone"
                  v-model="orderForm.phone"
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
                class="h-[48px]"
                type="submit"
                :disabled="isLoading"
              >
                <span v-if="isLoading">Отправка...</span>
                <span v-else>Заказать</span>
              </UiButton>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Модальное окно успеха -->
    <LazySuccessModal
      v-model:show="showSuccessModal"
      title="Спасибо за заказ!"
      message="Ваш заказ успешно оформлен. Мы свяжемся с вами в ближайшее время для подтверждения."
    />
  </div>
</template>

<style lang="scss" scoped>
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
