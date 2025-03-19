<template>
  <Body class="font-Inter">
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  </Body>
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Интерно - Магазин Матрасов и Кроватей` : 
    'Интерно - Магазин Матрасов и Кроватей';
  }
});
</script>

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

.form-label {
  @apply block text-gray-700 text-sm font-medium mb-2;
}

.form-input,
.form-select {
  @apply w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
         bg-white text-gray-700
         transition-colors duration-200
         placeholder-gray-400
         focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 h-[40px];
}

.select-container {
  @apply relative;
  
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

.form-select {
  @apply appearance-none w-full px-4 py-3 border-2 border-gray-300 rounded-md 
         bg-white text-gray-700 cursor-pointer;
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

.primary-btn {
  @apply w-full px-6 py-3 text-white bg-primary rounded-lg
         font-medium transition-all duration-200
         hover:bg-primary/90 hover:shadow-lg
         focus:outline-none focus:ring-2 focus:ring-primary/50
         active:transform active:scale-[0.98] h-[48px];
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