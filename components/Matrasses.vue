<template>
    <section class="py-16 pb-[3rem] bg-gray-50" id="mattresses">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Матрасы</h2>
        <div class="splide mattress-slider" ref="splide">
        <div class="splide__track">
        <ul class="splide__list">
          <li class="splide__slide pb-[1rem]" v-for="(mattress, index) in mattresses" :key="index">
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
                  @click="openInquiryForm(mattress)"
                  class="w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Узнать подробнее
                </button>
              </div>
            </div>
          </li>
        </ul>
        </div>
        </div>
      </div>
    </section>

    <!-- Inquiry Form Modal -->
    <Transition name="modal-backdrop">
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
     <Transition name="modal">
      <div v-if="showModal" class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-semibold">{{ selectedMattress?.title }}</h3>
          <button @click="showModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Product Description -->
        <div class="mb-6">
          <p class="text-gray-600">{{ selectedMattress?.description }}</p>
          <div class="flex items-center gap-2 mt-3">
            <span class="text-2xl font-bold text-primary">{{ selectedMattress?.newPrice }}₽</span>
            <span class="text-lg text-gray-400 line-through">{{ selectedMattress?.oldPrice }}₽</span>
          </div>
        </div>

        <form @submit.prevent="submitInquiry" class="space-y-6">
          <div class="form-group">
            <label class="form-label">Имя</label>
            <input 
              v-model="inquiryForm.name"
              type="text" 
              required
              class="form-input"
            />
          </div>
          <div>
            <label class="form-label">Телефон</label>
            <input 
              v-model="inquiryForm.phone"
              type="tel" 
              required
              class="form-input"
            />
          </div>
          <div>
            <label class="form-label">Размеры</label>
            <select 
              v-model="inquiryForm.size"
              required
              class="form-select"
            >
              <option value="">Выберите размер</option>
              <option value="twin">Twin (38" × 75")</option>
              <option value="twin-xl">Twin XL (38" × 80")</option>
              <option value="full">Full (54" × 75")</option>
              <option value="queen">Queen (60" × 80")</option>
              <option value="king">King (76" × 80")</option>
              <option value="cal-king">California King (72" × 84")</option>
            </select>
          </div>
          <button 
            type="submit"
            class="form-submit-btn"
          >
            Отправить
          </button>
        </form>
      </div>
      </Transition>
    </div>
    </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';

const showModal = ref(false);
const selectedMattress = ref(null);
const inquiryForm = ref({
  name: '',
  phone: '',
  size: ''
});

const mattresses = [
  {
    title: 'Матрас №1',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80',
    oldPrice: '1,299',
    newPrice: '899',
    description: 'Традиционный комфорт с передовой технологией пружин для превосходной поддержки. Имеет индивидуально обернутые пружины, которые минимизируют передачу движения и обеспечивают целевую поддержку вашего тела.'
  },
  {
    title: 'Матрас №2',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80',
    oldPrice: '1,799',
    newPrice: '1,299',
    description: 'Комфортное прилегание к телу для спокойного сна и снятия давления. Премиальная пена с эффектом памяти адаптируется к форме вашего тела, обеспечивая оптимальную поддержку и регуляцию температуры.'
  },
  {
    title: 'Матрас №3',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80',
    oldPrice: '1,999',
    newPrice: '1,499',
    description: 'Лучшее из двух миров с технологией пены с эффектом памяти и пружин. Сочетает в себе снятие давления пены с эффектом памяти с отзывчивой поддержкой карманных пружин.'
  },
  {
    title: 'Матрас №4',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80',
    oldPrice: '3,299',
    newPrice: '2,499',
    description: 'Премиальные материалы и мастерство для максимальной роскоши. Содержит несколько слоев высококачественных материалов, включая натуральный латекс, пену с эффектом памяти и высококачественные карманные пружины.'
  }
];

const splide = ref(null);

onMounted(() => {
  new Splide(splide.value, {
    type: 'slide',
    perPage: 3,
    gap: '2rem',
    pagination: false,
    arrows: true,
    breakpoints: {
        1024: {
        perPage: 2,
        },
        640: {
        perPage: 1,
        },
    },
  }).mount();
});

const openInquiryForm = (mattress) => {
  selectedMattress.value = mattress;
  showModal.value = true;
  inquiryForm.value = {
    name: '',
    phone: '',
    size: ''
  };
};

const submitInquiry = () => {
  console.log('Form submitted:', {
    mattress: selectedMattress.value.title,
    ...inquiryForm.value
  });
  showModal.value = false;
  inquiryForm.value = {
    name: '',
    phone: '',
    size: ''
  };
};

watch(showModal, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>

:root {
  --splide-nav-btn-color: #fff;
}

.splide__arrow {
  background: rgba(255, 255, 255, 0.3) !important;
  width: 3rem !important;
  height: 3rem !important;
}

.splide__arrow svg {
  width: 1.5rem !important;
  height: 1.5rem !important;
}

.splide__pagination__page {
  background: rgba(255, 255, 255, 0.3) !important;
}

.splide__pagination__page.is-active {
  background: #fff !important;
  transform: scale(1.4) !important;
}

.mattress-slider .splide__arrow {
  background: rgba(5, 128, 199, 0.1) !important;
}

.mattress-slider .splide__arrow svg {
  fill: #0580C7 !important;
}

/* Product Card */
.product-card {
  @apply relative rounded-lg shadow-lg overflow-hidden;
  height: 400px;
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