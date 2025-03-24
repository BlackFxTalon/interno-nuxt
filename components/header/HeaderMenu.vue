<script setup>
defineProps({
  headerMenuLinks: {
    type: [Array, Object, Set, Map],
    required: true,
  },
})
</script>

<template>
  <div class="hidden md:flex space-x-8">
    <NuxtLink
      v-for="(link, index) in headerMenuLinks"
      :key="index"
      :to="link.to"
      class="text-gray-700 hover:text-primary"
    >
      {{ link.text }}
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>

</style>
