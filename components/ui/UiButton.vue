<script setup>
const props = defineProps({
  tag: {
    type: String,
    default: 'button',
  },
})
</script>

<template>
  <component :is="props.tag" class="primary-btn">
    <slot />
  </component>
</template>

<style scoped lang="scss">
.primary-btn {
  @apply w-full text-white bg-primary rounded-lg
         font-medium transition-all duration-200
         hover:bg-primary/90 hover:shadow-lg
         focus:outline-none focus:ring-2 focus:ring-primary/50
         active:transform active:scale-[0.98] flex items-center justify-center px-5;

  @media (max-width: 768px) {
    font-size: 14px;
  }
}
</style>
