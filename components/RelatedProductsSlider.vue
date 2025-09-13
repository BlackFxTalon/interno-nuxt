<template>
  <div class="related-products-section mt-16">
    <h2 class="text-xl md:text-2xl font-bold mb-8">
      Смотрите также
    </h2>
    
    <!-- Splide Slider -->
    <div class="splide" ref="splideRef">
      <div class="splide__track">
        <ul class="splide__list">
          <li 
            v-for="product in relatedProducts" 
            :key="product.id"
            class="splide__slide pl-[15px] pr-[15px] pb-[20px]"
          >
            <ProductCard :item="product"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import ProductCard from './ProductCard.vue'
import Splide from '@splidejs/splide'
import '@splidejs/splide/dist/css/splide.min.css'

const props = defineProps({
  currentProductId: {
    type: String,
    required: true
  },
  productData: {
    type: Object,
    required: true
  },
  category: {
    type: String,
    default: 'beds'
  }
})

const splideRef = ref(null)
let splideInstance = null

// Get related products (excluding current product)
const relatedProducts = computed(() => {
  if (!props.productData || !props.productData[props.category]) return []
  const products = props.productData[props.category]
    .filter(product => product.id !== props.currentProductId)
  return products
})

onMounted(() => {
  // Initialize Splide
  if (splideRef.value) {
    splideInstance = new Splide(splideRef.value, {
      perPage: 4,
      perMove: 1,
      gap: '1rem',
      pagination: false,
      arrows: true,
      breakpoints: {
        1600: {
          perPage: 3,
        },
        1024: {
          perPage: 2,
        },
        500: {
          perPage: 1,
        }
      }
    })
    
    splideInstance.mount()
  }
})

// Cleanup
onUnmounted(() => {
  if (splideInstance) {
    splideInstance.destroy()
  }
})
</script>

<style scoped>
.related-products-section {
  position: relative;
}

:deep(.splide__arrow) {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
    fill: #374151;
  }
}

:deep(.splide__arrow--prev) {
  left: -30px;

  @media (max-width: 768px) {
    left: -10px;
  }
}

:deep(.splide__arrow--next) {
  right: -30px;

  @media (max-width: 768px) {
    right: -10px;
  }
}

@media (max-width: 768px) {
  :deep(.splide__arrow) {
    width: 20px;
    height: 20px;
    
    svg {
      width: 10px;
      height: 10px;
    }
  }
}
</style>
