<script setup>
import { ref } from 'vue'

const showInquiryModal = ref(false)

function openInquiryForm() {
  showInquiryModal.value = true
}
</script>

<template>
  <footer class="bg-gray-900 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8">
        <div>
          <h4 class="text-lg font-semibold mb-4">
            О нас
          </h4>
          <p class="text-gray-400">
            ООО "Интерно" - предоставляем качественные решения для сна
          </p>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">
            Категории
          </h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="#mattresses" class="text-gray-400 hover:text-white">
                Матрасы
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#toppers" class="text-gray-400 hover:text-white">
                Топперы
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#pillows" class="text-gray-400 hover:text-white">
                Подушки
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#beds" class="text-gray-400 hover:text-white">
                Кровати
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">
            Служба поддержки
          </h4>
          <ul class="space-y-2">
            <li>
              <button
                type="button"
                class="text-gray-400 hover:text-white cursor-pointer"
                @click="openInquiryForm"
              >
                Связаться с нами
              </button>
            </li>
            <li>
              <NuxtLink to="/policy" class="text-gray-400 hover:text-white">
                Политика конфиденциальности
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/returns" class="text-gray-400 hover:text-white">
                Возвраты
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/faq" class="text-gray-400 hover:text-white">
                Часто задаваемые вопросы
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <button
            type="button"
            class="text-lg font-semibold mb-4 cursor-pointer hover:text-gray-300 transition-colors text-left block w-full"
            @click="openInquiryForm"
          >
            Свяжитесь с нами
          </button>
          <div class="flex space-x-4">
            <NuxtLink to="https://vk.com/matraskrovatiekb" class="text-gray-400 hover:text-white">
              <span class="sr-only">Вконтакте</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <defs />
                <path class="a" d="M27.55,35.19V28.55c4.46.68,5.87,4.19,8.71,6.64H43.5a29.36,29.36,0,0,0-7.9-10.47c2.6-3.58,5.36-6.95,6.71-12.06H35.73c-2.58,3.91-3.94,8.49-8.18,11.51V12.66H18l2.28,2.82,0,10.05c-3.7-.43-6.2-7.2-8.91-12.87H4.5C7,20.32,12.26,37.13,27.55,35.19Z" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} ООО "Интерно". Все права защищены.</p>
      </div>
    </div>
  </footer>

  <!-- Модальное окно формы обратной связи -->
  <LazyInquiryFormModal v-model:show-modal="showInquiryModal" />
</template>

<style scoped>

</style>
