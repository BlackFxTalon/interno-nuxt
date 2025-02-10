<template>
  <section class="bg-gray-50">
      <div class="splide" ref="splide">
        <div class="splide__track">
          <ul class="splide__list">
            <li class="splide__slide" v-for="(image, index) in images" :key="index">
              <div class="relative h-[600px]">
                <img
                  :src="image"
                  alt="Luxury Bedroom"
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black bg-opacity-40"></div>
                <div class="relative container mx-auto px-4 h-full flex items-center">
                  <div class="text-white max-w-2xl">
                    <p class="text-5xl font-bold mb-4">Качественный сон, лучшая жизнь</p>
                    <p class="text-xl mb-8">Откройте для себя нашу премиальную коллекцию матрасов, разработанную для максимального комфорта и поддержки.</p>
                    <button class="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition">
                      Купить сейчас
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';

const images = [
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80'
];

const splide = ref(null);

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

<style scoped>
</style> 