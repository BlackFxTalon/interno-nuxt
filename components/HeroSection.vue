<script setup>
import Splide from '@splidejs/splide'
import { onMounted, ref } from 'vue'
import '@splidejs/splide/dist/css/splide.min.css'

const images = [
  'https://storage.yandexcloud.net/interno-images/optimized/public/images/heroSection/herosection-img-1.webp',
  'https://storage.yandexcloud.net/interno-images/optimized/public/images/heroSection/herosection-img-2.webp',
  'https://storage.yandexcloud.net/interno-images/optimized/public/images/heroSection/herosection-img-3.webp',
  'https://storage.yandexcloud.net/interno-images/optimized/public/images/heroSection/herosection-img-4.webp',
]

const splide = ref(null)

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
    },
  }).mount()
})

const showModal = ref(false)

function openInquiryForm() {
  showModal.value = true
}
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
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
                alt="image"
                decoding="async"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black bg-opacity-40" />
              <div class="relative container mx-auto px-4 h-full flex items-center">
                <div class="text-white max-w-2xl">
                  <h1 class="text-2xl md:text-3xl xl:text-5xl font-bold mb-4">
                    Качественный сон, лучшая жизнь
                  </h1>
                  <p class="text-sm md:text-base xl:text-xl mb-8">
                    Откройте для себя нашу премиальную коллекцию матрасов, разработанную для максимального комфорта и поддержки.
                  </p>
                  <UiButton
                    class="h-[48px] lg:max-w-max"
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
    <LazyInquiryFormModal
      v-model:show-modal="showModal"
    />
  </section>
</template>

<style lang="scss" scoped>

</style>
