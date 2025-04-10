<script setup>
const props = defineProps({
  isMenuOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['handleBtn'])

function handleBtn() {
  emit('handleBtn')
}
</script>

<template>
  <!-- Hamburger Button -->
  <button
    class="lg:hidden p-2 rounded-lg hover:bg-gray-100 relative z-50"
    aria-label="Toggle menu"
    @click="handleBtn"
  >
    <div class="w-6 h-6 relative flex items-center justify-center">
      <!-- First line -->
      <span
        class="absolute h-0.5 w-6 bg-gray-700 transform transition-all duration-300"
        :class="props.isMenuOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'"
      />

      <!-- Middle line -->
      <span
        class="absolute h-0.5 w-6 bg-gray-700 top-3 transition-all duration-200"
        :class="props.isMenuOpen ? 'opacity-0 -translate-x-2' : 'opacity-100 translate-x-0'"
      />

      <!-- Last line -->
      <span
        class="absolute h-0.5 w-6 bg-gray-700 transform transition-all duration-300"
        :class="props.isMenuOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'"
      />
    </div>
  </button>
</template>

<style lang="scss" scoped>

</style>
