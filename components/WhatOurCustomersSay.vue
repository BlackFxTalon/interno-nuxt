<script setup>

</script>

<template>
  <section class="py-24 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold mb-4">
          Что говорят наши клиенты
        </h2>
        <p class="text-xl text-gray-600">
          Реальный опыт наших уважаемых клиентов
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Testimonial 1 -->
        <div class="bg-white p-8 rounded-2xl shadow-lg">
          <div class="flex gap-1 mb-4">
            <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <p class="text-gray-700 mb-6">
            "Лучший сон за последние годы! Матрас с эффектом памяти идеально подошел для моей боли в спине."
          </p>
          <div class="flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/women/79.jpg"
              alt="Sarah Johnson"
              class="w-12 h-12 rounded-full object-cover"
            >
            <div>
              <h4 class="font-semibold">
                Сара Джонстон Бэби
              </h4>
            </div>
          </div>
        </div>

        <!-- Testimonial 2 -->
        <div class="bg-white p-8 rounded-2xl shadow-lg">
          <div class="flex gap-1 mb-4">
            <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <p class="text-gray-700 mb-6">
            "Гибридный матрас — идеальный баланс поддержки и комфорта. Очень рекомендую!"
          </p>
          <div class="flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Michael Chen"
              class="w-12 h-12 rounded-full object-cover"
            >
            <div>
              <h4 class="font-semibold">
                Михаэль Чанский Хуйхан
              </h4>
            </div>
          </div>
        </div>

        <!-- Testimonial 3 -->
        <div class="bg-white p-8 rounded-2xl shadow-lg">
          <div class="flex gap-1 mb-4">
            <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <p class="text-gray-700 mb-6">
            "Удивительное обслуживание клиентов, и доставка прошла гладко. Обожаю свой новый ортопедический матрас!"
          </p>
          <div class="flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Emily Rodriguez"
              class="w-12 h-12 rounded-full object-cover"
            >
            <div>
              <h4 class="font-semibold">
                Эмили Родри Шпилька
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>

</style>
