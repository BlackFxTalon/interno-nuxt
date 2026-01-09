<script setup>
const props = defineProps({
  tag: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
  },
})
</script>

<template>
  <component :is="props.tag" :type="props.type" :disabled="props.disabled" class="primary-btn">
    <slot />
  </component>
</template>

<style scoped lang="scss">
.primary-btn {
  @apply w-full text-white text-sm md:text-base bg-primary rounded-lg
         font-medium transition-all duration-200
         hover:bg-primary/90 hover:shadow-lg
         focus:outline-none focus:ring-2 focus:ring-primary/50
         active:transform active:scale-[0.98] flex items-center justify-center px-5;

  &:disabled {
    @apply bg-gray-400 cursor-not-allowed opacity-60;
    &:hover {
      @apply bg-gray-400 shadow-none;
    }
  }
}
</style>
