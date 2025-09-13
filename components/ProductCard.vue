<script setup>
import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'

const props = defineProps({
  item: {
    type: [Object, Set, Array, Map],
    required: true,
  },
  cardClass: {
    type: String,
    default: '',
  },
})

const router = useRouter()

function handleBtn(item) {
  router.push(`/product/${item.id}`)
}

const isMobile = useMediaQuery('(max-width: 768px)', {
  ssrWidth: 768,
})

const btnText = computed(() => {
  if (isMobile.value) {
    return 'Подробнее'
  }
  return 'Узнать подробнее'
})
</script>

<template>
  <div 
  class="product-card"
  :class="props.cardClass"
  >
    <NuxtImg
      :src="props.item.images[0].url"
      :alt="props.item.images[0].alt"
      format="webp"
      class="card-image"
    />
    <div class="card-content">
      <h3 class="text-base md:text-xl font-semibold mb-4">
        {{ props.item.name }}
      </h3>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 mb-4">
          <span 
          class="text-sm md:text-base font-bold text-primary"
          v-if="Object.values(props.item.prices)[0]"
          >
          {{ Object.values(props.item.prices)[0] }} ₽
          </span>
          <span v-if="Object.values(props.item.prices).length > 1">-</span>
          <span 
          class="text-sm md:text-base font-bold text-primary"
          v-if="Object.values(props.item.prices).length > 1"
          >
          {{ Object.values(props.item.prices)[Object.values(props.item.prices).length - 1] }} ₽
          </span>
        </div>
      </div>
      <UiButton
      class="h-[40px]"
        type="button"
        @click="handleBtn(props.item)"
      >
        {{ btnText }}
      </UiButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-card {
    min-width: 320px;
    width: 100%;
    min-height: 420px;
    border-radius: 0.5rem;
    padding: 10px;
    --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
      min-width: 100%;
      max-width: 320px;
      min-height: 320px;
    }
}

.product-card .card-image {
  @apply object-contain;
}

.card-image {
  width: 100%;
  height: 250px;
  max-width: 300px;

  @media (max-width: 768px) {
      height: 150px;
      max-width: 150px;
      margin: auto;
  }
}

.card-content {
  @apply w-full;
}
</style>
