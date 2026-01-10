<script setup>
useHead({
  meta: [
    {
      name: 'description',
      content: 'Официальный сайт Интерно. Купить матрасы, кровати, подушки и товары для сна от производителя с доставкой в Екатеринбурге и РФ.',
    },
  ],
})

const { data: productData } = await useAsyncData('products', async () => {
  const [matrasses, beds, pillows, toppers] = await Promise.all([
    import('~/data/matrasses.json'),
    import('~/data/beds.json'),
    import('~/data/pillows.json'),
    import('~/data/toppers.json'),
  ])

  return {
    matrasses: matrasses.default.matrasses || [],
    beds: beds.default.beds || [],
    pillows: pillows.default.pillows || [],
    toppers: toppers.default.toppers || [],
  }
})

const matrasses = computed(() => productData.value?.matrasses ?? [])
const toppers = computed(() => productData.value?.toppers ?? [])
const pillows = computed(() => productData.value?.pillows ?? [])
const beds = computed(() => productData.value?.beds ?? [])
</script>

<template>
  <main>
    <HeroSection />

    <FindYourPerfectMatrass />

    <ProductsListSection
      id="mattresses"
      class="bg-gray-50"
      title="Матрасы"
      :items-data="matrasses"
    />

    <ProductsListSection
      id="toppers"
      class="bg-white"
      title="Топперы"
      :items-data="toppers"
    />

    <Features />

    <ProductsListSection
      id="pillows"
      class="bg-white"
      title="Подушки"
      :items-data="pillows"
    />

    <ProductsListSection
      id="beds"
      class="bg-gray-50"
      title="Кровати"
      :items-data="beds"
    />

    <!-- LimitedTimeOffer -->
    <!-- <LimitedTimeOffer/> -->

    <!-- Beds -->
    <!-- <Beds/> -->

    <!-- Children Beds -->
    <!-- <ChildrenBeds/> -->

    <!-- <WhatOurCustomersSay/> -->
  </main>
</template>

<style>

</style>
