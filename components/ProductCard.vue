<script setup>
const props = defineProps({
  item: {
    type: [Object, Set, Array, Map],
    required: true,
  },
})

const emit = defineEmits(['handleBtn'])

function handleBtn(item) {
  emit('handleBtn', item)
}
</script>

<template>
  <div class="product-card">
    <NuxtImg
      :src="props.item.image"
      :alt="props.item.name"
      format="webp"
      class="card-image"
    />
    <div class="card-content">
      <h3 class="text-2xl font-semibold mb-4">
        {{ props.item.name }}
      </h3>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl font-bold text-primary">{{ Object.values(props.item.prices)[0] }} ₽</span>-
          <span class="text-2xl font-bold text-primary">{{ Object.values(props.item.prices)[Object.values(props.item.prices).length - 1] }} ₽</span>
        </div>
      </div>
      <UiButton
        type="button"
        @click="handleBtn(props.item)"
      >
        Узнать подробнее
      </UiButton>
    </div>
  </div>
</template>

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
