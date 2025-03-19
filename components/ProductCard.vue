<template>
    <div class="product-card">
              <img :src="mattress.image" :alt="mattress.title" class="card-image"/>
              <div class="card-content">
                <h3 class="text-2xl font-semibold mb-4">{{ mattress.title }}</h3>
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2 mb-4">
                    <span class="text-2xl font-bold text-primary">{{ mattress.newPrice }}₽</span>
                    <span class="text-md text-gray-400 line-through">{{ mattress.oldPrice }}₽</span>
                  </div>
                </div>
                <button 
                  @click="handleBtn(mattress)"
                  class="w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Узнать подробнее
                </button>
              </div>
    </div>
</template>

<script setup>

const props = defineProps({
   mattress: {
    type: [Object, Set, Array, Map],
    required: true
   }
});

const emit = defineEmits(['handleBtn']);

const handleBtn = (mattress) => {
  emit('handleBtn', mattress);
}

</script>

<style lang="scss" scoped>

.product-card {
  @apply relative rounded-lg shadow-lg overflow-hidden h-[400px] max-w-[350px];
}

.card-image {
  @apply w-full h-full;
}

.card-content {
  @apply p-6 absolute w-full bg-white;
  bottom: 0;
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out;
}

.product-card:hover .card-content {
  transform: translateY(0);
}

</style>