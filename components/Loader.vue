<script setup>
import { watch } from 'vue'

const { isLoading } = useLoader()

watch(isLoading, (newVal) => {
  if (import.meta.client && document?.body) {
    document.body.style.overflow = newVal ? 'hidden' : ''
  }
})
</script>

<template>
  <div
    v-if="isLoading"
    class="loader"
  >
    <div class="pulse" />
  </div>
</template>

<style lang="scss" scoped>
.loader {
    @apply fixed flex justify-center items-center inset-0 w-full h-full z-10 bg-black/60;
}

.pulse {
    @apply w-10 h-10 rounded-full;
    background-color: var(--primary-color, #4a90e2);
    animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
    0% {
        @apply scale-[0.6] opacity-40;
    }
    50% {
        @apply scale-100 opacity-100;
    }
    100% {
        @apply scale-[0.6] opacity-40;
    }
}
</style>
