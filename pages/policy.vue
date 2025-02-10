<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-primary text-white p-8">
          <h1 class="text-3xl font-bold mb-2">Наши правила</h1>
        </div>

        <!-- Content -->
        <div class="p-8">
          <!-- Privacy Policy -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Политика конфиденциальности</h2>
            <div class="space-y-4 text-gray-600">
              <p>Мы серьезно относимся к вашей конфиденциальности. Эта политика описывает, как мы собираем, используем и защищаем вашу личную информацию.</p>
              
              <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-4">Информация, которую мы собираем</h3>
              <ul class="list-disc pl-5 space-y-2">
                <li>Личная информация (имя, адрес электронной почты, номер телефона)</li>
                <li>Адреса доставки и выставления счетов</li>
                <li>Платежная информация</li>
                <li>Предпочтения и история покупок</li>
              </ul>

              <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-4">Как мы используем вашу информацию</h3>
              <ul class="list-disc pl-5 space-y-2">
                <li>Обработка и выполнение ваших заказов</li>
                <li>Сообщайте о своих покупках</li>
                <li>Рассылать рекламные предложения (с вашего согласия)</li>
                <li>Улучшить наши продукты и услуги</li>
              </ul>
            </div>
          </section>

          <!-- Terms of Service -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Условия обслуживания</h2>
            <div class="space-y-4 text-gray-600">
              <p>Используя наши услуги, вы соглашаетесь с этими условиями. Пожалуйста, внимательно прочтите их.</p>

              <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-4">Информация о продукте</h3>
              <ul class="list-disc pl-5 space-y-2">
                <li>We strive to display accurate product information</li>
                <li>Colors may vary slightly from images</li>
                <li>Prices and availability are subject to change</li>
              </ul>

              <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-4">Shipping & Delivery</h3>
              <ul class="list-disc pl-5 space-y-2">
                <li>Free delivery on orders over $500</li>
                <li>Delivery times may vary by location</li>
                <li>Professional setup included with premium mattresses</li>
              </ul>
            </div>
          </section>

          <!-- Return Policy -->
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Return Policy</h2>
            <div class="space-y-4 text-gray-600">
              <p>We want you to be completely satisfied with your purchase.</p>

              <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-4">100-Night Trial</h3>
              <ul class="list-disc pl-5 space-y-2">
                <li>Try your mattress for 100 nights</li>
                <li>Free returns within trial period</li>
                <li>Full refund on unused products</li>
                <li>We'll arrange pickup for returns</li>
              </ul>

              <div class="bg-primary/5 rounded-xl p-6 mt-6">
                <h4 class="text-lg font-semibold text-primary mb-2">Note About Returns</h4>
                <p>For hygiene reasons, mattresses must be in original condition and free from stains or damage to be eligible for return.</p>
              </div>
            </div>
          </section>

          <!-- Warranty -->
          <section>
            <h2 class="text-2xl font-bold mb-6">Warranty</h2>
            <div class="space-y-4 text-gray-600">
              <p>Our products are built to last and backed by comprehensive warranty coverage.</p>

              <h3 class="text-xl font-semibold text-gray-800 mt-6 mb-4">Coverage Details</h3>
              <ul class="list-disc pl-5 space-y-2">
                <li>10-year warranty on mattresses</li>
                <li>5-year warranty on furniture</li>
                <li>Coverage for manufacturing defects</li>
                <li>Free repairs or replacement if needed</li>
              </ul>

              <div class="bg-primary/5 rounded-xl p-6 mt-6">
                <h4 class="text-lg font-semibold text-primary mb-2">Warranty Registration</h4>
                <p>Please register your product within 30 days of purchase to activate your warranty coverage.</p>
                <button class="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Register Product
                </button>
              </div>
            </div>
          </section>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 p-8 border-t">
          <p class="text-gray-500 text-center">
            If you have any questions about our policies, please 
            <a href="/contact" class="text-primary hover:underline">contact us</a>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
useHead({
    title: 'Политика конфиденциальности',
    description: 'Ознакомьтесь с нашей политикой конфиденциальности, условиями обслуживания, политикой возврата и информацией о гарантии.'
  });
</script>

<style lang="scss" scoped>

</style>