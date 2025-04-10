<script setup>
const select = defineModel()
</script>

<template>
  <div class="select-container">
    <select
      v-model="select"
      class="ui-select"
    >
      <slot name="options" />
    </select>
  </div>
</template>

<style scoped>
.select-container {
  @apply relative w-full;

  &::after {
    content: '';
    position: absolute;
    right: 0.75rem;
    top: 50%;
    width: 22px;
    height: 22px;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    transform: translateY(-50%);
    transition: transform 0.2s ease;
    pointer-events: none;
  }

  &:focus-within::after {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234f46e5' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    transform: translateY(-50%) rotate(180deg);
  }
}
.ui-select {
    @apply w-full px-4 py-3 border-2
         bg-white text-gray-700
         transition-colors duration-200
         placeholder-gray-400
         focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none  border-gray-300 rounded-md
         cursor-pointer h-[50px];
         padding-right: 2.5rem;
        text-indent: 1px;
        text-overflow: '';

        &::-ms-expand {
    display: none;
  }

  &:focus {
    @apply outline-none ring-2 ring-primary/20 border-primary;
  }

  &:hover:not(:focus) {
    @apply border-primary/50;
  }

  option {
    @apply py-2;
  }
}
</style>
