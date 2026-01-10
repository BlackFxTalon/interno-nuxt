<script setup lang="ts">
import HamburgerButton from './HamburgerButton.vue'
// Add mobile menu state
const isMenuOpen = ref(false)

const handleMenuOpen = () => isMenuOpen.value = !isMenuOpen.value

if (import.meta.client) {
  watch(isMenuOpen, (newValue) => {
    document.body.classList.toggle('overflow-hidden', newValue)
  })

  onBeforeUnmount(() => {
    document.body.classList.remove('overflow-hidden')
  })
}

// Mobile menu links
const headerMenuLinks = [
  { to: '/about', text: 'О нас' },
  { to: '/#mattresses', text: 'Матрасы' },
  { to: '/#toppers', text: 'Топперы' },
  { to: '/#pillows', text: 'Подушки' },
  { to: '/#beds', text: 'Кровати' },
  { to: '/#children-beds', text: 'Детские кровати' },
]
</script>

<template>
  <header class="sticky top-0 bg-white shadow-md z-10">
    <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
      <NuxtLink class="flex items-center" to="/">
        <img
          decoding="async"
          src="/logo.svg"
          alt="interno logo"
          class="h-[26px] animate-logo"
        >
      </NuxtLink>

      <HamburgerButton
        :is-menu-open="isMenuOpen"
        @handle-btn="handleMenuOpen"
      />

      <HeaderMenu
        :header-menu-links="headerMenuLinks"
      />
    </nav>

    <LazyHeaderMobileMenu
      v-model="isMenuOpen"
      :header-menu-links="headerMenuLinks"
    />

    <!-- Backdrop -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 bg-black bg-opacity-20 lg:hidden z-30"
        @click="isMenuOpen = false"
      />
    </transition>
  </header>
</template>

<style lang="scss" scoped>

</style>
