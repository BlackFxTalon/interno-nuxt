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
  const now = new Date().getTime()
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

function submitOffer() {
  // Here you would typically send the form data to your backend
  // console.log('Offer form submitted:', offerForm.value)

  // Close the modal and reset form
  showOfferModal.value = false
  offerForm.value = {
    name: '',
    email: '',
    phone: '',
  }
}
</script>

<template>
  <!-- Limited Time Offer -->
  <section class="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
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
          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
            <div class="text-3xl font-bold">
              {{ timer.days }}
            </div>
            <div class="text-sm">
              Дни
            </div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
            <div class="text-3xl font-bold">
              {{ timer.hours }}
            </div>
            <div class="text-sm">
              Часы
            </div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
            <div class="text-3xl font-bold">
              {{ timer.minutes }}
            </div>
            <div class="text-sm">
              Минуты
            </div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
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
    <div v-if="showOfferModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <Transition name="modal">
        <div v-if="showOfferModal" class="bg-white rounded-lg p-8 max-w-md w-full mx-4 my-8">
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
            <div class="form-group">
              <label class="form-label">Имя</label>
              <input
                v-model="offerForm.name"
                type="text"
                required
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label class="form-label">Почта</label>
              <input
                v-model="offerForm.email"
                type="email"
                required
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label class="form-label">Телефон</label>
              <input
                v-model="offerForm.phone"
                type="tel"
                required
                class="form-input"
              >
            </div>
            <button
              type="submit"
              class="primary-btn"
            >
              Отправить заявку
            </button>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>

</style>
