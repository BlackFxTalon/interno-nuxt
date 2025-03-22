<template>
    <div class="product-card">
                <NuxtImg 
                :src="item.image" 
                :alt="item.name"
                format="webp"
                class="card-image"
                />
              <div class="card-content">
                <h3 class="text-2xl font-semibold mb-4">{{ item.name }}</h3>
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2 mb-4">
                    <span class="text-2xl font-bold text-primary">{{ item.prices["80x190"] }} ₽</span>-
                    <span class="text-2xl font-bold text-primary">{{ item.prices["200x190"] }} ₽</span>
                  </div>
                </div>
                <button 
                  @click="handleBtn(item)"
                  class="primary-btn"
                >
                  Узнать подробнее
                </button>
              </div>
    </div>
</template>

<script setup>

const props = defineProps({
   item: {
    type: [Object, Set, Array, Map],
    required: true
   }
});

const emit = defineEmits(['handleBtn']);

const handleBtn = (item) => {
  emit('handleBtn', item);
}

</script>

<style lang="scss" scoped>

.product-card {
  @apply relative rounded-lg shadow-lg overflow-hidden h-[350px] max-w-[350px] p-[10px];
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