<script setup>
defineProps({
  headerMenuLinks: {
    type: [Array, Object, Set, Map],
    required: true,
  },
})

const isMenuOpen = defineModel()
</script>

<template>
  <!-- Mobile Menu -->
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-10 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-10 scale-95"
  >
    <div
      v-if="isMenuOpen"
      class="absolute top-0 left-0 right-0 bg-white shadow-xl py-4 px-4 lg:hidden z-40 mt-[4.5rem]"
    >
      <div class="flex flex-col space-y-1">
        <NuxtLink
          v-for="(link, index) in headerMenuLinks"
          :key="index"
          :to="link.to"
          class="text-gray-700 hover:text-primary py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-2"
          :style="{
            transitionDelay: `${index * 50}ms`,
          }"
          @click="isMenuOpen = false"
        >
          {{ link.text }}
        </NuxtLink>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>

</style>
