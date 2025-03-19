<template>
  <section class="bg-gray-50">
      <div class="splide" ref="splide">
        <div class="splide__track">
          <ul class="splide__list">
            <li class="splide__slide" v-for="(image, index) in images" :key="index">
              <div class="relative h-[600px]">
                <NuxtImg 
                :src="image"
                alt="image"
                format="webp"
                class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black bg-opacity-40"></div>
                <div class="relative container mx-auto px-4 h-full flex items-center">
                  <div class="text-white max-w-2xl">
                    <h1 class="text-5xl font-bold mb-4">Качественный сон, лучшая жизнь</h1>
                    <p class="text-xl mb-8">Откройте для себя нашу премиальную коллекцию матрасов, разработанную для максимального комфорта и поддержки.</p>
                    <button 
                      @click="openInquiryForm"
                      class="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition"
                    >
                      Купить сейчас
                    </button>
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
          <h3 class="text-2xl font-semibold">Оформить заказ</h3>
          <button @click="showModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitInquiry" class="space-y-6">
          <div class="form-group">
            <label class="form-label">Имя</label>
            <input 
              v-model="inquiryForm.name"
              type="text" 
              required
              class="form-input"
            />
          </div>
          <div>
            <label class="form-label">Email</label>
            <input 
              v-model="inquiryForm.email"
              type="email" 
              required
              class="form-input"
            />
          </div>
          <div>
            <label class="form-label">Телефон</label>
            <input 
              v-model="inquiryForm.phone"
              type="tel" 
              required
              class="form-input"
            />
          </div>
          <button 
            type="submit"
            class="w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Отправить
          </button>
        </form>
      </div>
      </Transition>
    </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';

const images = [
  '/images/heroSection/herosection-img-1.png',
  '/images/heroSection/herosection-img-2.png',
  '/images/heroSection/herosection-img-3.png',
  '/images/heroSection/herosection-img-4.png'
];

const splide = ref(null);
const showModal = ref(false);
const inquiryForm = ref({
  name: '',
  email: '',
  phone: ''
});

const openInquiryForm = () => {
  showModal.value = true;
  inquiryForm.value = {
    name: '',
    email: '',
    phone: ''
  };
};

const submitInquiry = () => {
  console.log('Form submitted:', inquiryForm.value);
  showModal.value = false;
  inquiryForm.value = {
    name: '',
    email: '',
    phone: ''
  };
};

watch(showModal, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onMounted(() => {
  new Splide(splide.value, {
    type: 'fade',
    rewind: true,
    arrows: true,
    pagination: true,
    autoplay: true,
    interval: 5000,
    speed: 1000,
    pauseOnHover: false,
  }).mount();
});
</script>

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