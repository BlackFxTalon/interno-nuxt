<script setup>
useHead({
  title: 'Возвраты',
  description: 'Политика возврата товаров ООО "Интерно". Узнайте условия возврата и обмена товаров.',
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 md:py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-primary text-white p-4 md:p-8">
          <h1 class="text-2xl md:text-3xl font-bold mb-1 md:mb-2">
            Возвраты
          </h1>
          <p class="text-sm md:text-base text-white/90">
            Последнее обновление: {{ new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>
        </div>

        <!-- Content -->
        <div class="p-4 md:p-8">
          <!-- Introduction -->
          <section class="mb-6 md:mb-12">
            <div class="space-y-2 md:space-y-4 text-gray-600">
              <p class="text-sm md:text-base">
                ООО "Интерно" стремится обеспечить полное удовлетворение наших клиентов. Мы понимаем, что иногда
                товар может не соответствовать вашим ожиданиям, и мы готовы помочь вам с возвратом или обменом.
              </p>
              <p class="text-sm md:text-base">
                Настоящая политика возврата описывает условия и процедуры возврата товаров, приобретенных у нас.
              </p>
            </div>
          </section>

          <!-- Return Period -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              1. Срок возврата
            </h2>
            <div class="space-y-2 md:space-y-4 text-gray-600">
              <p class="text-sm md:text-base">
                Вы имеете право вернуть товар надлежащего качества в течение <strong>14 календарных дней</strong>
                с момента получения товара, не считая дня покупки.
              </p>
              <p class="text-sm md:text-base">
                Для товаров ненадлежащего качества срок возврата составляет <strong>30 календарных дней</strong>
                с момента обнаружения недостатков.
              </p>
            </div>
          </section>

          <!-- Conditions for Return -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              2. Условия возврата
            </h2>
            <div class="space-y-2 md:space-y-4 text-gray-600">
              <h3 class="text-lg md:text-xl font-semibold text-gray-800 mt-4 md:mt-6 mb-2 md:mb-4">
                2.1. Товар надлежащего качества
              </h3>
              <p class="text-sm md:text-base">
                Товар может быть возвращен, если:
              </p>
              <ul class="list-disc pl-5 space-y-1 md:space-y-2 text-sm md:text-base">
                <li>Товар не был в употреблении</li>
                <li>Сохранены товарный вид, потребительские свойства, пломбы, фабричные ярлыки</li>
                <li>Товар не входит в перечень товаров, не подлежащих возврату</li>
                <li>Имеются документы, подтверждающие покупку товара у нас</li>
              </ul>

              <h3 class="text-lg md:text-xl font-semibold text-gray-800 mt-4 md:mt-6 mb-2 md:mb-4">
                2.2. Товар ненадлежащего качества
              </h3>
              <p class="text-sm md:text-base">
                Товар с недостатками может быть возвращен или обменян, если:
              </p>
              <ul class="list-disc pl-5 space-y-1 md:space-y-2 text-sm md:text-base">
                <li>Обнаружены производственные дефекты</li>
                <li>Товар не соответствует описанию на сайте</li>
                <li>Товар имеет повреждения, полученные при транспортировке</li>
                <li>Товар не соответствует заявленным характеристикам</li>
              </ul>
            </div>
          </section>

          <!-- Return Procedure -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              3. Процедура возврата
            </h2>
            <div class="space-y-2 md:space-y-4 text-gray-600">
              <p class="text-sm md:text-base">
                Для возврата товара выполните следующие шаги:
              </p>
              <ol class="list-decimal pl-5 space-y-2 md:space-y-3 text-sm md:text-base">
                <li>
                  <strong>Свяжитесь с нами</strong> — используйте форму обратной связи на сайте или свяжитесь
                  с нашим отделом обслуживания клиентов для уведомления о намерении вернуть товар.
                </li>
                <li>
                  <strong>Подготовьте товар</strong> — упакуйте товар в оригинальную упаковку со всеми
                  аксессуарами и документами.
                </li>
                <li>
                  <strong>Предоставьте документы</strong> — приложите копию чека или иного документа,
                  подтверждающего покупку.
                </li>
                <li>
                  <strong>Организуйте доставку</strong> — мы можем организовать вывоз товара или вы можете
                  вернуть его самостоятельно.
                </li>
                <li>
                  <strong>Ожидайте обработки</strong> — после получения товара мы проверим его состояние
                  и обработаем возврат в течение 10 рабочих дней.
                </li>
              </ol>
            </div>
          </section>

          <!-- Refund -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              4. Возврат денежных средств
            </h2>
            <div class="space-y-2 md:space-y-4 text-gray-600">
              <p class="text-sm md:text-base">
                Возврат денежных средств осуществляется следующими способами:
              </p>
              <ul class="list-disc pl-5 space-y-1 md:space-y-2 text-sm md:text-base">
                <li>
                  <strong>Банковская карта</strong> — средства возвращаются на ту же карту, с которой была
                  произведена оплата, в течение 10 рабочих дней после принятия решения о возврате.
                </li>
                <li>
                  <strong>Наличные</strong> — если оплата была произведена наличными, возврат осуществляется
                  наличными в день возврата товара.
                </li>
                <li>
                  <strong>Банковский перевод</strong> — по запросу клиента возможен возврат на банковский счет.
                </li>
              </ul>
              <p class="mt-2 md:mt-4 text-sm md:text-base">
                Стоимость доставки товара при возврате не возвращается, за исключением случаев, когда товар
                имеет недостатки или не соответствует описанию.
              </p>
            </div>
          </section>

          <!-- Exchange -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              5. Обмен товара
            </h2>
            <div class="space-y-2 md:space-y-4 text-gray-600">
              <p class="text-sm md:text-base">
                Вместо возврата денежных средств вы можете обменять товар на другой товар из нашего ассортимента.
                При обмене применяются следующие правила:
              </p>
              <ul class="list-disc pl-5 space-y-1 md:space-y-2 text-sm md:text-base">
                <li>Обмен возможен в течение 14 дней с момента покупки</li>
                <li>Товар должен соответствовать условиям возврата</li>
                <li>При разнице в цене производится доплата или возврат разницы</li>
                <li>Обмен возможен только на товар, имеющийся в наличии</li>
              </ul>
            </div>
          </section>

          <!-- Non-Returnable Items -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              6. Товары, не подлежащие возврату
            </h2>
            <div class="space-y-2 md:space-y-4 text-gray-600">
              <p class="text-sm md:text-base">
                В соответствии с законодательством Российской Федерации, следующие товары не подлежат возврату
                при отсутствии недостатков:
              </p>
              <ul class="list-disc pl-5 space-y-1 md:space-y-2 text-sm md:text-base">
                <li>Товары, изготовленные по индивидуальному заказу</li>
                <li>Товары, которые были в употреблении и утратили товарный вид</li>
                <li>Товары с поврежденной упаковкой или без упаковки</li>
                <li>Товары без документов, подтверждающих покупку</li>
              </ul>
              <p class="mt-2 md:mt-4 text-sm md:text-base">
                <strong>Важно:</strong> Товары с производственными дефектами или недостатками могут быть
                возвращены независимо от их состояния.
              </p>
            </div>
          </section>

          <!-- Shipping Costs -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              7. Расходы на доставку при возврате
            </h2>
            <div class="space-y-2 md:space-y-4 text-gray-600">
              <p class="text-sm md:text-base">
                Расходы на доставку товара обратно в наш склад зависят от причины возврата:
              </p>
              <ul class="list-disc pl-5 space-y-1 md:space-y-2 text-sm md:text-base">
                <li>
                  <strong>Возврат по инициативе клиента</strong> — расходы на доставку несет клиент.
                </li>
                <li>
                  <strong>Возврат из-за недостатков товара</strong> — расходы на доставку несет продавец.
                </li>
                <li>
                  <strong>Возврат из-за ошибки продавца</strong> — расходы на доставку несет продавец.
                </li>
              </ul>
            </div>
          </section>

          <!-- Warranty -->
          <section class="mb-6 md:mb-12">
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              8. Гарантия на товары
            </h2>
            <div class="space-y-2 md:space-y-4 text-gray-600">
              <p class="text-sm md:text-base">
                На все наши товары распространяется гарантия производителя. Срок гарантии указан в документах,
                прилагаемых к товару, и составляет от 1 до 5 лет в зависимости от типа товара.
              </p>
              <p class="text-sm md:text-base">
                В течение гарантийного срока мы обязуемся устранить недостатки товара или заменить товар,
                если недостатки не могут быть устранены.
              </p>
            </div>
          </section>

          <!-- Contact Information -->
          <section>
            <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
              9. Контактная информация
            </h2>
            <div class="space-y-2 md:space-y-4 text-gray-600">
              <p class="text-sm md:text-base">
                Если у вас есть вопросы о возврате товара или вам нужна помощь с процедурой возврата,
                пожалуйста, свяжитесь с нами:
              </p>
              <div class="bg-primary/5 rounded-xl p-4 md:p-6 mt-4 md:mt-6">
                <p class="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                  ООО "Интерно"
                </p>
                <p class="mb-1 md:mb-2 text-sm md:text-base">
                  Екатеринбург, Россия
                </p>
                <p class="mb-2 md:mb-4 text-sm md:text-base">
                  Вы можете связаться с нами через форму обратной связи на нашем веб-сайте.
                </p>
              </div>
            </div>
          </section>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 p-4 md:p-8 border-t">
          <p class="text-gray-500 text-center text-sm md:text-base">
            Если у вас есть вопросы о возврате товаров, пожалуйста,
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
