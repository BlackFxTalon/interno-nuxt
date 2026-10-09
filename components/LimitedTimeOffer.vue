<script setup>
// Countdown Timer
const timer = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

const targetDate = new Date()
targetDate.setDate(targetDate.getDate() + 3) // 3 days from now

let timerInterval

function updateTimer() {
  const now = Date.now()
  const distance = targetDate.getTime() - now

  timer.value = {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  }

  if (distance < 0) {
    clearInterval(timerInterval)
    timer.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
}

onMounted(() => {
  updateTimer()
  timerInterval = setInterval(updateTimer, 1000)
})

onBeforeUnmount(() => {
  if (timerInterval)
    clearInterval(timerInterval)
})

const showOfferModal = ref(false)
const offerForm = ref({
  name: '',
  email: '',
  phone: '',
})

const { isLoading, submitStatus, errorMessage, consentGiven, submitForm } = useFormSubmit({
  showModal: showOfferModal,
  captchaContainerId: 'captcha-container-offer',
  formId: 'offer',
  successModal: {
    title: 'Спасибо!',
    message: 'Заявка на предложение отправлена. Мы свяжемся с вами.',
  },
})

async function submitOffer() {
  if (await submitForm(offerForm.value))
    offerForm.value = { name: '', email: '', phone: '' }
}
</script>

<template>
  <!-- Limited Time Offer -->
  <section class="py-16 bg-linear-to-r from-primary to-primary/80 text-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-8">
        <h2 class="text-4xl font-bold mb-4">
          Ограниченное предложение
        </h2>
        <p class="text-xl mb-8">
          Получите дополнительную скидку 10% на любой матрас
        </p>

        <!-- Countdown Timer -->
        <div class="flex flex-wrap justify-center gap-4 mb-8">
          <div class="bg-white/20 backdrop-blur-xs rounded-lg p-4 min-w-[100px]">
            <div class="text-3xl font-bold">
              {{ timer.days }}
            </div>
            <div class="text-sm">
              Дни
            </div>
          </div>
          <div class="bg-white/20 backdrop-blur-xs rounded-lg p-4 min-w-[100px]">
            <div class="text-3xl font-bold">
              {{ timer.hours }}
            </div>
            <div class="text-sm">
              Часы
            </div>
          </div>
          <div class="bg-white/20 backdrop-blur-xs rounded-lg p-4 min-w-[100px]">
            <div class="text-3xl font-bold">
              {{ timer.minutes }}
            </div>
            <div class="text-sm">
              Минуты
            </div>
          </div>
          <div class="bg-white/20 backdrop-blur-xs rounded-lg p-4 min-w-[100px]">
            <div class="text-3xl font-bold">
              {{ timer.seconds }}
            </div>
            <div class="text-sm">
              Секунды
            </div>
          </div>
        </div>

        <button
          class="bg-white text-primary px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors"
          @click="showOfferModal = true"
        >
          Получить предложение
        </button>
      </div>
    </div>
  </section>

  <!-- Offer Form Modal -->
  <Transition name="modal-backdrop">
    <div v-if="showOfferModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <Transition name="modal">
        <div v-if="showOfferModal" class="bg-white rounded-lg p-8 max-w-md w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-semibold text-gray-900">
              Получите скидку 10%
            </h3>
            <button class="text-gray-500 hover:text-gray-700" @click="showOfferModal = false">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form class="space-y-6" @submit.prevent="submitOffer">
            <p v-if="submitStatus === 'error'" role="alert" class="text-red-700">
              {{ errorMessage }}
            </p>
            <div class="form-group">
              <label for="offer-name" class="form-label">Имя</label>
              <input
                id="offer-name"
                v-model="offerForm.name"
                maxlength="120"
                :disabled="isLoading"
                type="text"
                required
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="offer-email" class="form-label">Почта (необязательно)</label>
              <input
                id="offer-email"
                v-model="offerForm.email"
                maxlength="254"
                :disabled="isLoading"
                type="email"
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="offer-phone" class="form-label">Телефон</label>
              <input
                id="offer-phone"
                v-model="offerForm.phone"
                v-maska="'+7(9##)###-##-##'"
                :disabled="isLoading"
                type="tel"
                required
                class="form-input"
              >
            </div>
            <PersonalDataConsent id="consent-offer" v-model="consentGiven" :disabled="isLoading" />
            <ClientOnly>
              <div id="captcha-container-offer" style="min-height: 100px" />
            </ClientOnly>
            <UiButton type="submit" :disabled="isLoading">
              {{ isLoading ? 'Отправка...' : 'Отправить заявку' }}
            </UiButton>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
@reference "../assets/css/tailwind.css";

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary;
}
</style>
