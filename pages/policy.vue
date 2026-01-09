<script setup>
useHead({
  title: 'Политика конфиденциальности',
  description: 'Ознакомьтесь с политикой конфиденциальности ООО "Интерно". Узнайте, как мы собираем, используем и защищаем вашу личную информацию.',
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 md:py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-primary text-white p-4 md:p-8">
          <h1 class="text-2xl md:text-3xl font-bold mb-2">
            Политика конфиденциальности
          </h1>
          <p class="text-sm md:text-base text-white/90">
            Последнее обновление: {{ new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>
        </div>

        <!-- Content -->
        <div class="p-4 md:p-8">
          <!-- Introduction -->
          <section class="mb-6 md:mb-12">
            <div class="space-y-3 md:space-y-4 text-sm md:text-base text-gray-600">
              <p>
                ООО "Интерно" (далее — "мы", "наш", "Компания") серьезно относится к защите вашей конфиденциальности.
                Настоящая Политика конфиденциальности описывает, как мы собираем, используем, храним и защищаем вашу
                личную информацию при использовании нашего веб-сайта и услуг.
              </p>
              <p>
                Используя наш веб-сайт и услуги, вы соглашаетесь с условиями настоящей Политики конфиденциальности.
                Если вы не согласны с условиями данной политики, пожалуйста, не используйте наш веб-сайт.
              </p>
            </div>
          </section>

          <!-- Information We Collect -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              1. Информация, которую мы собираем
            </h2>
            <div class="space-y-3 md:space-y-4 text-sm md:text-base text-gray-600">
              <h3 class="text-lg md:text-xl font-semibold text-gray-800 mt-4 md:mt-6 mb-3 md:mb-4">
                1.1. Личная информация
              </h3>
              <p>Мы можем собирать следующую личную информацию:</p>
              <ul class="list-disc pl-5 space-y-2 text-sm md:text-base">
                <li>Имя и фамилия</li>
                <li>Адрес электронной почты</li>
                <li>Номер телефона</li>
                <li>Почтовый адрес (для доставки и выставления счетов)</li>
                <li>Платежная информация (обрабатывается через защищенные платежные системы)</li>
                <li>Предпочтения и история покупок</li>
              </ul>

              <h3 class="text-lg md:text-xl font-semibold text-gray-800 mt-4 md:mt-6 mb-3 md:mb-4">
                1.2. Автоматически собираемая информация
              </h3>
              <p>При посещении нашего веб-сайта мы автоматически собираем определенную информацию:</p>
              <ul class="list-disc pl-5 space-y-2 text-sm md:text-base">
                <li>IP-адрес</li>
                <li>Тип браузера и операционной системы</li>
                <li>Страницы, которые вы посещаете</li>
                <li>Время и дата посещения</li>
                <li>Источник перехода на наш сайт</li>
              </ul>
            </div>
          </section>

          <!-- How We Use Information -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              2. Как мы используем вашу информацию
            </h2>
            <div class="space-y-3 md:space-y-4 text-sm md:text-base text-gray-600">
              <p>Мы используем собранную информацию для следующих целей:</p>
              <ul class="list-disc pl-5 space-y-2 text-sm md:text-base">
                <li>Обработка и выполнение ваших заказов</li>
                <li>Связь с вами по поводу ваших заказов и запросов</li>
                <li>Отправка информации о статусе заказа и доставке</li>
                <li>Улучшение качества наших продуктов и услуг</li>
                <li>Персонализация вашего опыта на нашем веб-сайте</li>
                <li>Отправка маркетинговых материалов (только с вашего согласия)</li>
                <li>Соблюдение юридических обязательств</li>
                <li>Предотвращение мошенничества и обеспечение безопасности</li>
              </ul>
            </div>
          </section>

          <!-- Information Sharing -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              3. Раскрытие информации третьим лицам
            </h2>
            <div class="space-y-3 md:space-y-4 text-sm md:text-base text-gray-600">
              <p>Мы не продаем и не передаем вашу личную информацию третьим лицам, за исключением следующих случаев:</p>
              <ul class="list-disc pl-5 space-y-2 text-sm md:text-base">
                <li>Службы доставки — для выполнения заказов</li>
                <li>Платежные системы — для обработки платежей</li>
                <li>Поставщики услуг — компании, которые помогают нам в работе веб-сайта и бизнеса</li>
                <li>По требованию закона — когда это требуется по закону или для защиты наших прав</li>
              </ul>
              <p class="mt-3 md:mt-4">
                Все третьи лица, с которыми мы делимся информацией, обязаны защищать вашу личную информацию
                и использовать ее только в целях, для которых она была предоставлена.
              </p>
            </div>
          </section>

          <!-- Data Security -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              4. Безопасность данных
            </h2>
            <div class="space-y-3 md:space-y-4 text-sm md:text-base text-gray-600">
              <p>
                Мы применяем различные меры безопасности для защиты вашей личной информации от несанкционированного
                доступа, изменения, раскрытия или уничтожения:
              </p>
              <ul class="list-disc pl-5 space-y-2 text-sm md:text-base">
                <li>Использование шифрования SSL/TLS для передачи данных</li>
                <li>Ограниченный доступ к личной информации только для уполномоченных сотрудников</li>
                <li>Регулярное обновление систем безопасности</li>
                <li>Мониторинг систем на предмет подозрительной активности</li>
              </ul>
              <p class="mt-3 md:mt-4">
                Однако ни один метод передачи через Интернет или метод электронного хранения не является на 100% безопасным.
                Хотя мы стремимся использовать коммерчески приемлемые средства для защиты вашей личной информации,
                мы не можем гарантировать ее абсолютную безопасность.
              </p>
            </div>
          </section>

          <!-- Cookies -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              5. Использование файлов cookie
            </h2>
            <div class="space-y-3 md:space-y-4 text-sm md:text-base text-gray-600">
              <p>
                Наш веб-сайт использует файлы cookie для улучшения вашего опыта. Файлы cookie — это небольшие текстовые
                файлы, которые сохраняются на вашем устройстве при посещении веб-сайта.
              </p>
              <p>Мы используем файлы cookie для:</p>
              <ul class="list-disc pl-5 space-y-2 text-sm md:text-base">
                <li>Запоминания ваших предпочтений</li>
                <li>Анализа использования веб-сайта</li>
                <li>Улучшения функциональности сайта</li>
              </ul>
              <p class="mt-3 md:mt-4">
                Вы можете настроить свой браузер для отказа от файлов cookie, но это может повлиять на функциональность
                нашего веб-сайта.
              </p>
            </div>
          </section>

          <!-- Your Rights -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              6. Ваши права
            </h2>
            <div class="space-y-3 md:space-y-4 text-sm md:text-base text-gray-600">
              <p>Вы имеете право:</p>
              <ul class="list-disc pl-5 space-y-2 text-sm md:text-base">
                <li>Получить доступ к вашей личной информации</li>
                <li>Исправить неточную или неполную информацию</li>
                <li>Удалить вашу личную информацию (в определенных случаях)</li>
                <li>Отозвать согласие на обработку данных</li>
                <li>Ограничить обработку вашей личной информации</li>
                <li>Получить копию ваших данных в структурированном формате</li>
              </ul>
              <p class="mt-3 md:mt-4">
                Для осуществления этих прав, пожалуйста, свяжитесь с нами, используя контактную информацию,
                указанную в конце данной политики.
              </p>
            </div>
          </section>

          <!-- Data Retention -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              7. Хранение данных
            </h2>
            <div class="space-y-3 md:space-y-4 text-sm md:text-base text-gray-600">
              <p>
                Мы храним вашу личную информацию только в течение времени, необходимого для достижения целей,
                для которых она была собрана, или в соответствии с требованиями законодательства.
              </p>
              <p>
                После истечения срока хранения мы безопасно удалим или анонимизируем вашу личную информацию.
              </p>
            </div>
          </section>

          <!-- Children's Privacy -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              8. Конфиденциальность детей
            </h2>
            <div class="space-y-3 md:space-y-4 text-sm md:text-base text-gray-600">
              <p>
                Наш веб-сайт не предназначен для лиц младше 18 лет. Мы сознательно не собираем личную информацию
                от детей. Если мы узнаем, что собрали личную информацию от ребенка без согласия родителей,
                мы предпримем шаги для удаления этой информации.
              </p>
            </div>
          </section>

          <!-- Changes to Policy -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              9. Изменения в политике конфиденциальности
            </h2>
            <div class="space-y-3 md:space-y-4 text-sm md:text-base text-gray-600">
              <p>
                Мы можем периодически обновлять настоящую Политику конфиденциальности. Мы уведомим вас о любых
                изменениях, разместив новую Политику конфиденциальности на этой странице и обновив дату
                "Последнее обновление".
              </p>
              <p>
                Рекомендуем периодически просматривать эту страницу для получения информации о том, как мы защищаем
                вашу информацию.
              </p>
            </div>
          </section>

          <!-- Contact Information -->
          <section>
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              10. Контактная информация
            </h2>
            <div class="space-y-3 md:space-y-4 text-sm md:text-base text-gray-600">
              <p>Если у вас есть вопросы или запросы относительно настоящей Политики конфиденциальности, пожалуйста, свяжитесь с нами:</p>
              <div class="bg-primary/5 rounded-xl p-4 md:p-6 mt-4 md:mt-6">
                <p class="font-semibold text-gray-800 mb-2 text-sm md:text-base">
                  ООО "Интерно"
                </p>
                <p class="mb-2 text-sm md:text-base">
                  Екатеринбург, Россия
                </p>
                <p class="mb-3 md:mb-4 text-sm md:text-base">
                  Вы можете связаться с нами через форму обратной связи на нашем веб-сайте.
                </p>
              </div>
            </div>
          </section>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 p-4 md:p-8 border-t">
          <p class="text-sm md:text-base text-gray-500 text-center">
            Если у вас есть вопросы о нашей политике конфиденциальности, пожалуйста,
            <NuxtLink to="/" class="text-primary hover:underline">
              свяжитесь с нами
            </NuxtLink>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
