<script setup>
import Splide from '@splidejs/splide'
import { onMounted, ref } from 'vue'
import '@splidejs/splide/dist/css/splide.min.css'

const defaultHeroSection = {
  title: 'Качественный сон, лучшая жизнь',
  description: 'Откройте для себя нашу премиальную коллекцию матрасов, разработанную для максимального комфорта и поддержки.',
  buttonText: 'Купить сейчас',
  images: [
    {
      src: 'https://storage.yandexcloud.net/interno-images/optimized/public/images/heroSection/herosection-img-1.webp',
      alt: 'Коллекция товаров для сна Интерно',
    },
    {
      src: 'https://storage.yandexcloud.net/interno-images/optimized/public/images/heroSection/herosection-img-2.webp',
      alt: 'Матрас Интерно в интерьере спальни',
    },
    {
      src: 'https://storage.yandexcloud.net/interno-images/optimized/public/images/heroSection/herosection-img-3.webp',
      alt: 'Кровать и матрас Интерно',
    },
    {
      src: 'https://storage.yandexcloud.net/interno-images/optimized/public/images/heroSection/herosection-img-4.webp',
      alt: 'Спальня с продукцией Интерно',
    },
  ],
}

const { data: heroSectionContent } = await useAsyncData('hero-section-content', () => {
  return queryCollection('sections')
    .where('stem', '=', 'sections/hero')
    .first()
})

const heroSection = computed(() => heroSectionContent.value ?? defaultHeroSection)
const images = computed(() => heroSection.value.images.length ? heroSection.value.images : defaultHeroSection.images)

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
          <li v-for="(image, index) in images" :key="image.src" class="splide__slide">
            <div class="relative h-[300px] md:h-[400px] xl:h-[600px]">
              <NuxtImg
                :src="image.src"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
                :alt="image.alt"
                decoding="async"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black/40" />
              <div class="relative container mx-auto px-4 h-full flex items-center">
                <div class="text-white max-w-2xl">
                  <h1 class="text-2xl md:text-3xl xl:text-5xl font-bold mb-4">
                    {{ heroSection.title }}
                  </h1>
                  <p class="text-sm md:text-base xl:text-xl mb-8">
                    {{ heroSection.description }}
                  </p>
                  <UiButton
                    class="h-[48px] lg:max-w-max"
                    @click="openInquiryForm"
                  >
                    {{ heroSection.buttonText }}
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

<style scoped>

</style>
