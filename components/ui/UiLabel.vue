<script setup>
</script>

<template>
  <label class="ui-label">
    <slot />
  </label>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.ui-label {
        @apply block text-gray-700 text-sm font-medium mb-2;
}
</style>
