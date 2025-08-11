<script setup>
import matrassesData from '/data/matrasses.json'
import toppersData from '/data/toppers.json'
import pillowsData from '/data/pillows.json'
import bedsData from '/data/beds.json'

useHead({
  meta: [
    {
      name: 'description',
      content: 'Официальный сайт Интерно. Купить матрасы, кровати, подушки и товары для сна от производителя с доставкой в Екатеринбурге и РФ.',
    },
  ],
})
const matrasses = matrassesData.matrasses
const toppers = toppersData.toppers
const pillows = pillowsData.pillows
const beds = bedsData.beds
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

    <Features/>

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
