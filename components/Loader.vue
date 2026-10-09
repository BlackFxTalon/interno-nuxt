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

<style scoped>
@reference "../assets/css/tailwind.css";

.loader {
    @apply fixed flex justify-center items-center inset-0 w-full h-full z-[70] bg-black/60;
}

.pulse {
    @apply w-10 h-10 rounded-full;
    background-color: var(--primary-color, #4a90e2);
    animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(0.6);
        opacity: 0.4;
    }
    50% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
