<script setup>
</script>

<template>
  <input class="ui-input">
</template>

<style scoped lang="scss">
.ui-input {
  @apply w-full px-4 py-3 border-2 border-gray-200 rounded-lg
         bg-white text-gray-700
         transition-colors duration-200
         placeholder-gray-400
         focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 h-[40px];

    @media (max-width: 768px) {
        font-size: 14px;
    }    
}
</style>
