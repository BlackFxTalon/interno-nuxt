<script setup lang="ts">
</script>

<template>

    <main>
      <!-- Hero Section -->
      <HeroSection />

      <FindYourPerfectMatrass/>

      <Matrasses />

      <!-- Pillows -->
      <Pillows/>

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

      <!-- Children Beds -->
      <ChildrenBeds/>

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
</template>

<style>

</style>