<script setup>
import Splide from '@splidejs/splide'
import { onMounted, ref, watch } from 'vue'
import '@splidejs/splide/dist/css/splide.min.css'

const images = [
  '/images/heroSection/herosection-img-1.png',
  '/images/heroSection/herosection-img-2.png',
  '/images/heroSection/herosection-img-3.png',
  '/images/heroSection/herosection-img-4.png',
]

const splide = ref(null)
const showModal = ref(false)
const inquiryForm = ref({
  name: '',
  email: '',
  phone: '',
})

function openInquiryForm() {
  showModal.value = true
  inquiryForm.value = {
    name: '',
    email: '',
    phone: '',
  }
}

function submitInquiry() {
  // console.log('Form submitted:', inquiryForm.value)
  showModal.value = false
  inquiryForm.value = {
    name: '',
    email: '',
    phone: '',
  }
}

watch(showModal, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  new Splide(splide.value, {
    type: 'fade',
    rewind: true,
    arrows: false,
    pagination: true,
    autoplay: true,
    interval: 5000,
    speed: 1000,
    pauseOnHover: false,
    mediaQuery: 'min',
    breakpoints: {
      768: {
        arrows: true,
      },
    }
  }).mount()
})
</script>

<template>
  <section class="bg-gray-50">
    <div ref="splide" class="splide">
      <div class="splide__track">
        <ul class="splide__list">
          <li v-for="(image, index) in images" :key="index" class="splide__slide">
            <div class="relative h-[300px] md:h-[400px] xl:h-[600px]">
              <NuxtImg
                :src="image"
                alt="image"
                format="webp"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black bg-opacity-40" />
              <div class="relative container mx-auto px-4 h-full flex items-center">
                <div class="text-white max-w-2xl">
                  <h1 class="text-2xl md:text-3xl xl:text-5xl font-bold mb-4">
                    Качественный сон, лучшая жизнь
                  </h1>
                  <p class="xl:text-xl mb-8">
                    Откройте для себя нашу премиальную коллекцию матрасов, разработанную для максимального комфорта и поддержки.
                  </p>
                  <UiButton
                    class="max-w-max h-[48px]"
                    @click="openInquiryForm"
                  >
                    Купить сейчас
                  </UiButton>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- Inquiry Form Modal -->
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

            <form class="space-y-6" @submit.prevent="submitInquiry">
              <div class="form-group">
                <UiLabel>Имя</UiLabel>
                <UiInput
                  v-model="inquiryForm.name"
                  type="text"
                  required
                />
              </div>
              <div>
                <UiLabel>Email</UiLabel>
                <UiInput
                  v-model="inquiryForm.email"
                  type="email"
                  required
                />
              </div>
              <div>
                <UiLabel>Телефон</UiLabel>
                <UiInput
                  v-model="inquiryForm.phone"
                  type="tel"
                  required
                />
              </div>
              <UiButton
                type="submit"
                class="max-w-max"
              >
                Отправить
              </UiButton>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </section>
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
