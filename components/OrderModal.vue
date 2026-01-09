<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

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

function resetForm() {
  orderForm.value = {
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

function formatOrderDetails() {
  const details = []
  details.push(`Товар: ${props.name}`)
  details.push(`Цена: ${props.price} ₽`)
  details.push(`Размер: ${props.currentSize}`)

  if (props.height) {
    details.push(`Высота: ${props.height} см`)
  }
  if (props.weight) {
    details.push(`Вес: ${props.weight} кг`)
  }
  if (props.color) {
    details.push(`Цвет: ${props.color}`)
  }
  if (props.liftingMechanism) {
    details.push(`Подъемный механизм: ${props.liftingMechanism}`)
  }
  if (props.antivandalVelor) {
    details.push(`Антивандальный велюр: ${props.antivandalVelor}`)
  }
  if (props.robotVacuumCleanerLegs) {
    details.push(`Ножки под робот-пылесос (13 см): ${props.robotVacuumCleanerLegs}`)
  }

  return details.join('\n')
}

async function submitOrder() {
  isLoading.value = true
  submitStatus.value = 'idle'
  errorMessage.value = ''

  const accessKey = config.public.web3formsAccessKeyTwo

  if (!accessKey) {
    submitStatus.value = 'error'
    errorMessage.value = 'Не настроен ключ доступа Web3Forms. Пожалуйста, добавьте NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY в переменные окружения.'
    isLoading.value = false
    return
  }

  try {
    const orderDetails = formatOrderDetails()

    const data = await $fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: {
        access_key: accessKey,
        subject: `Новый заказ с сайта Интерно - ${props.name}`,
        name: orderForm.value.name,
        email: orderForm.value.email,
        phone: orderForm.value.phone,
        from_name: 'Интерно - Форма заказа',
        message: `Детали заказа:\n\n${orderDetails}`,
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
      throw new Error(data.message || 'Ошибка при отправке заказа')
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

watch(showOrderForm, (isOpen) => {
  updateBodyOverflow(isOpen)
  if (isOpen) {
    resetForm()
  }
})

onMounted(() => {
  if (showOrderForm.value) {
    updateBodyOverflow(true)
  }
})

onUnmounted(() => {
  updateBodyOverflow(false)
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
    <SuccessModal
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
