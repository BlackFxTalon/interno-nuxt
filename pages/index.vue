<script setup lang="ts">

// Add mobile menu state
const isMenuOpen = ref(false);

// Mobile menu links
const headerMenuLinks = [
  { to: '#mattresses', text: 'Матрасы' },
  { to: '#wardrobes', text: 'Шкафы' },
  { to: '#beds', text: 'Кровати' },
  { to: '#accesories', text: 'Аксессуары' }
];
</script>

<template>
    <header class="sticky top-0 bg-white shadow-md z-50 font-Inter">
      <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <img src="/logo.svg" alt="DreamRest" class="h-[26px] animate-logo" />
        </div>

        <!-- Hamburger Button -->
        <button 
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 relative z-50"
          aria-label="Toggle menu"
        >
          <div class="w-6 h-6 relative flex items-center justify-center">
            <!-- First line -->
            <span 
              class="absolute h-0.5 w-6 bg-gray-700 transform transition-all duration-300"
              :class="isMenuOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'"
            ></span>
            
            <!-- Middle line -->
            <span 
              class="absolute h-0.5 w-6 bg-gray-700 top-3 transition-all duration-200"
              :class="isMenuOpen ? 'opacity-0 -translate-x-2' : 'opacity-100 translate-x-0'"
            ></span>
            
            <!-- Last line -->
            <span 
              class="absolute h-0.5 w-6 bg-gray-700 transform transition-all duration-300"
              :class="isMenuOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'"
            ></span>
          </div>
        </button>
        <div class="hidden md:flex space-x-8">
          <NuxtLink
          v-for="link in headerMenuLinks" 
          :to="link.to" 
          class="text-gray-700 hover:text-primary">
           {{ link.text }}
          </NuxtLink>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-10 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-10 scale-95"
        >
          <div
            v-if="isMenuOpen"
            class="absolute top-0 left-0 right-0 bg-white shadow-xl py-4 px-4 md:hidden z-40 mt-20"
          >
            <div class="flex flex-col space-y-1">
              <NuxtLink 
                v-for="(link, index) in headerMenuLinks" 
                :key="index"
                :to="link.to"
                class="text-gray-700 hover:text-primary py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-2"
                @click="isMenuOpen = false"
                :style="{
                  transitionDelay: `${index * 50}ms`
                }"
              >
                {{ link.text }}
              </NuxtLink>
            </div>
          </div>
      </transition>

      <!-- Backdrop -->
      <transition
          enter-active-class="transition-opacity duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div 
            v-if="isMenuOpen"
            class="fixed inset-0 bg-black bg-opacity-20 md:hidden z-30"
            @click="isMenuOpen = false"
          ></div>
        </transition>
    </header>

    <main class="font-Inter">
      <!-- Hero Section -->
      <HeroSection />

      <FindYourPerfectMatrass/>

      <Matrasses />

      <!-- Categories -->
      <!-- <section class="py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Наши категории</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="group cursor-pointer">
              <div class="relative overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80" 
                  alt="Матрасы"
                  class="w-full h-64 object-cover transition group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 class="text-white text-xl font-semibold">Матрасы</h3>
                </div>
              </div>
            </div>
            <div class="group cursor-pointer">
              <div class="relative overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80" 
                  alt="Шкафы"
                  class="w-full h-64 object-cover transition group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 class="text-white text-xl font-semibold">Шкафы</h3>
                </div>
              </div>
            </div>
            <div class="group cursor-pointer">
              <div class="relative overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80" 
                  alt="Кровати"
                  class="w-full h-64 object-cover transition group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 class="text-white text-xl font-semibold">Кровати</h3>
                </div>
              </div>
            </div>
            <div class="group cursor-pointer">
              <div class="relative overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80" 
                  alt="Аксессуары"
                  class="w-full h-64 object-cover transition group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 class="text-white text-xl font-semibold">Аксессуары</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> -->

      <!-- LimitedTimeOffer -->
      <LimitedTimeOffer/>

       <!-- Beds -->
      <Beds/>

      <!-- Features -->
      <section class="bg-gray-50 py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Качественные материалы</h3>
              <p class="text-gray-600">Премиум материалы для долговечного комфорта и прочности</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">10-летняя гарантия</h3>
              <p class="text-gray-600">Спокойствие с нашей комплексной гарантией</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Бесплатная доставка</h3>
              <p class="text-gray-600">Бесплатная доставка и установка</p>
            </div>
          </div>
        </div>
      </section>

      <WhatOurCustomersSay/>
    </main>

    <footer class="bg-gray-900 text-white py-12 font-Inter">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <h4 class="text-lg font-semibold mb-4">О нас</h4>
            <p class="text-gray-400">Предоставляем качественные решения для сна с 1990 года</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">Категории</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white">Матрасы</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Шкафы</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Кровати</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Аксессуары</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">Служба поддержки</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white">Связаться с нами</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Политика доставки</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Возвраты</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white">Часто задаваемые вопросы</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">Свяжитесь с нами</h4>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white">
                <span class="sr-only">Facebook</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <span class="sr-only">Instagram</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Магазин матрасов и шкафов. Все права защищены.</p>
        </div>
      </div>
    </footer>
</template>

<style>

</style>