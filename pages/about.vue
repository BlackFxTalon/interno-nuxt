<script setup>
useHead({
  title: 'О нас',
  description: 'Узнайте о пути Интерно по созданию идеального сна с 2010 года.',
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[400px]">
      <NuxtImg
        src="https://storage.yandexcloud.net/interno-images/optimized/public/images/about-us/about-us-img-1.webp"
        alt="about us image"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black bg-opacity-50" />
      <div class="relative container mx-auto px-4 h-full flex items-center">
        <div class="text-white max-w-2xl">
          <h1 class="text-5xl font-bold mb-4">
            Об Интерно
          </h1>
          <p class="text-xl">
            Создаем идеальный сон с 2010 года
          </p>
        </div>
      </div>
    </section>

    <!-- Our Story -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold mb-6">
              Наша история
            </h2>
            <p class="text-gray-600 mb-6">
              Основанная в 2010 году, компания Интерно начиналась с простой миссии: помогать людям лучше спать. Мы считали, что качественный сон не должен быть роскошью, а основополагающим правом каждого.
            </p>
            <p class="text-gray-600">
              За эти годы мы выросли из небольшой мастерской в ведущего производителя матрасов и мебели для спальни премиум-класса, никогда не отступая от своей приверженности качеству и инновациям.
            </p>
          </div>
          <div class="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <NuxtImg
              src="https://storage.yandexcloud.net/interno-images/optimized/public/images/about-us/about-us-img-2.webp"
              alt="Our Workshop"
              loading="lazy"
              decoding="async"
              class="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Our Values -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">
          Наши ценности
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-xl shadow-lg">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">
              Качество прежде всего
            </h3>
            <p class="text-gray-600">
              Мы никогда не идем на компромисс в отношении материалов или мастерства, гарантируя, что каждое изделие соответствует нашим высоким стандартам.
            </p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-lg">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">
              Инновации
            </h3>
            <p class="text-gray-600">
              Мы постоянно исследуем и разрабатываем новые технологии для улучшения качества сна.
            </p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-lg">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">
              Обслуживание клиентов
            </h3>
            <p class="text-gray-600">
              Мы стремимся к тому, чтобы каждый клиент нашел идеальное решение для сна.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Process -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">
          Наши процессы
        </h2>
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="relative pl-16">
              <div class="absolute left-0 top-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span class="text-primary font-bold text-xl">1</span>
              </div>
              <h3 class="text-xl font-semibold mb-4">
                Исследования и разработки
              </h3>
              <p class="text-gray-600">
                Мы изучаем режимы сна и тестируем материалы, чтобы создать идеальные конструкции матрасов.
              </p>
            </div>

            <div class="relative pl-16">
              <div class="absolute left-0 top-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span class="text-primary font-bold text-xl">2</span>
              </div>
              <h3 class="text-xl font-semibold mb-4">
                Выбор материала
              </h3>
              <p class="text-gray-600">
                В производстве нашей продукции используются только материалы высочайшего качества.
              </p>
            </div>

            <div class="relative pl-16">
              <div class="absolute left-0 top-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span class="text-primary font-bold text-xl">3</span>
              </div>
              <h3 class="text-xl font-semibold mb-4">
                Мастерство
              </h3>
              <p class="text-gray-600">
                Опытные мастера тщательно собирают каждый матрас вручную.
              </p>
            </div>

            <div class="relative pl-16">
              <div class="absolute left-0 top-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span class="text-primary font-bold text-xl">4</span>
              </div>
              <h3 class="text-xl font-semibold mb-4">
                Контроль качества
              </h3>
              <p class="text-gray-600">
                Строгие испытания гарантируют, что каждый продукт соответствует нашим стандартам.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact CTA -->
    <section class="py-20 bg-primary">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-white mb-6">
          Готовы ли вы спать лучше?
        </h2>
        <p class="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
          Посетите наш выставочный зал или свяжитесь с нами, чтобы узнать больше о нашей продукции и найти свой идеальный матрас.
        </p>
        <div class="flex justify-center gap-4">
          <button class="bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Перейти в выставочный зал
          </button>
          <button class="bg-primary border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors">
            Связаться с нами
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
