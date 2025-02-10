<script setup>

// Add mobile menu state
const isMenuOpen = ref(false);

// Mobile menu links
const headerMenuLinks = [
  { to: '/about', text: 'О нас' },
  { to: '#mattresses', text: 'Матрасы' },
  { to: '#wardrobes', text: 'Шкафы' },
  { to: '#beds', text: 'Кровати' },
  { to: '#accesories', text: 'Аксессуары' }
];
</script>

<template>
    <header class="sticky top-0 bg-white shadow-md z-50">
      <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink class="flex items-center" to="/">
            <img src="/logo.svg" alt="DreamRest" class="h-[26px] animate-logo" />
        </NuxtLink>

        <!-- Hamburger Button -->
        <button 
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 relative z-50"
          aria-label="Toggle menu"
        >
          <div class="w-6 h-6 relative flex items-center justify-center">
            <!-- First line -->
            <span 
              class="absolute h-0.5 w-6 bg-gray-700 transform transition-all duration-300"
              :class="isMenuOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'"
            ></span>
            
            <!-- Middle line -->
            <span 
              class="absolute h-0.5 w-6 bg-gray-700 top-3 transition-all duration-200"
              :class="isMenuOpen ? 'opacity-0 -translate-x-2' : 'opacity-100 translate-x-0'"
            ></span>
            
            <!-- Last line -->
            <span 
              class="absolute h-0.5 w-6 bg-gray-700 transform transition-all duration-300"
              :class="isMenuOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'"
            ></span>
          </div>
        </button>
        <div class="hidden md:flex space-x-8">
          <NuxtLink
          v-for="link in headerMenuLinks" 
          :to="link.to" 
          class="text-gray-700 hover:text-primary">
           {{ link.text }}
          </NuxtLink>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-10 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-10 scale-95"
        >
          <div
            v-if="isMenuOpen"
            class="absolute top-0 left-0 right-0 bg-white shadow-xl py-4 px-4 md:hidden z-40 mt-20"
          >
            <div class="flex flex-col space-y-1">
              <NuxtLink 
                v-for="(link, index) in headerMenuLinks" 
                :key="index"
                :to="link.to"
                class="text-gray-700 hover:text-primary py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-2"
                @click="isMenuOpen = false"
                :style="{
                  transitionDelay: `${index * 50}ms`
                }"
              >
                {{ link.text }}
              </NuxtLink>
            </div>
          </div>
      </transition>

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
            class="fixed inset-0 bg-black bg-opacity-20 md:hidden z-30"
            @click="isMenuOpen = false"
          ></div>
        </transition>
    </header>
</template>

<style lang="scss" scoped>

</style>