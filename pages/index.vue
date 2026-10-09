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
  return await $fetch('/api/products')
})

const matrasses = computed(() => productData.value?.matrasses ?? [])
const toppers = computed(() => productData.value?.toppers ?? [])
const pillows = computed(() => productData.value?.pillows ?? [])
const beds = computed(() => productData.value?.beds ?? [])
const childrenBeds = computed(() => productData.value?.childrenBeds ?? [])

const productListSections = [
  {
    id: 'mattresses',
    class: 'bg-gray-50',
    title: 'Матрасы',
    itemsData: matrasses,
  },
  {
    id: 'toppers',
    class: 'bg-white',
    title: 'Топперы',
    itemsData: toppers,
  },
  {
    id: 'pillows',
    class: 'bg-white',
    title: 'Подушки',
    itemsData: pillows,
  },
  {
    id: 'beds',
    class: 'bg-gray-50',
    title: 'Кровати',
    itemsData: beds,
  },
  {
    id: 'childrenBeds',
    class: 'bg-white',
    title: 'Детские кровати',
    itemsData: childrenBeds,
  },
]
</script>

<template>
  <main>
    <HeroSection />

    <FindYourPerfectMatrass />

    <ProductsListSection
      v-for="section in productListSections"
      :id="section.id"
      :key="section.id"
      :class="section.class"
      :title="section.title"
      :items-data="section.itemsData"
    />

    <!-- LimitedTimeOffer -->
    <!-- <LimitedTimeOffer/> -->

    <!-- <WhatOurCustomersSay/> -->
  </main>
</template>

<style>

</style>
