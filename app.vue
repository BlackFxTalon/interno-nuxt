<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Интерно - Матрасы, подушки, кровати и другие товары для здорового сна в Екатеринбурге.`
      : 'Интерно - Матрасы, подушки, кровати и другие товары для здорового сна в Екатеринбурге.'
  },
  meta: [
    {
      name: 'keywords',
      content: 'интерно, Екатеринбург, матрасы, подушки, кровати, детские кровати',
    },
  ],
})
</script>

<template>
  <Body class="font-Inter">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </Body>
</template>

<style lang="scss">
html, body {
  scroll-behavior: smooth;
}

/* Logo Animation */
@keyframes logo-pulse {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(5, 128, 199, 0));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 8px rgba(5, 128, 199, 0.3));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(5, 128, 199, 0));
  }
}

.animate-logo {
  animation: logo-pulse 2s ease-in-out;
  animation-delay: 0.5s;
}

/* Modal Backdrop Animation */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

/* Modal Content Animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Form Styles */
.form-group {
  @apply relative;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  @apply bg-primary/60;
  border-radius: 6px;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: background-color 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-primary;
}

/* Firefox Scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--primary-color) #f3f4f6;
}

:root {
  --primary-color: rgb(5, 128, 199);
}
</style>
