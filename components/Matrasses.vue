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

      <!-- Inquiry Form Modal -->
      <Transition name="modal-backdrop">
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Transition name="modal">
          <div v-if="showModal" class="bg-white w-full h-full relative">
            <!-- Кнопка закрытия -->
            <button 
              @click="showModal = false" 
              class="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="h-full overflow-y-auto p-8">
              <div class="container mx-auto">
                <div class="flex justify-between items-start gap-12">
                  <!-- Левая часть с изображением -->
                  <div class="w-1/2">
                    <img :src="selectedMattress?.image" :alt="selectedMattress?.title" class="w-full h-[600px] object-cover rounded-lg"/>
                  </div>
                  
                  <!-- Правая часть с информацией -->
                  <div class="w-1/2">
                    <h3 class="text-3xl font-semibold">{{ selectedMattress?.title }}</h3>
                    
                    <div class="flex items-center gap-3 mt-4">
                      <span class="text-4xl font-bold text-primary">{{ selectedMattress?.newPrice }}₽</span>
                      <span class="text-2xl text-gray-400 line-through">{{ selectedMattress?.oldPrice }}₽</span>
                    </div>

                    <!-- Высота матраса -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Высота матраса</h4>
                      <div class="radio-group">
                        <label v-for="height in heights" :key="height.value">
                          <input 
                            type="radio" 
                            v-model="inquiryForm.height" 
                            :value="height.value"
                            class="form-radio"
                          />
                          <span class="text-lg">{{ height.name }}</span>
                        </label>
                      </div>
                    </div>

                    <!-- Чехол матраса -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Чехол матраса</h4>
                      <div class="radio-group">
                        <label v-for="cover in covers" :key="cover.id">
                          <input 
                            type="radio" 
                            v-model="inquiryForm.cover" 
                            :value="cover.id"
                            class="form-radio"
                          />
                          <span class="text-lg">{{ cover.name }} {{ cover.price > 0 ? `(+${cover.price}₽)` : '' }}</span>
                        </label>
                      </div>
                    </div>

                    <!-- Размер матраса -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Размер матраса</h4>
                      <select 
                        v-model="inquiryForm.size"
                        required
                        class="form-select w-full text-lg"
                      >
                        <option value="">Выберите размер</option>
                        <option value="twin">Twin (90 × 190)</option>
                        <option value="full">Full (140 × 190)</option>
                        <option value="queen">Queen (160 × 200)</option>
                        <option value="king">King (180 × 200)</option>
                      </select>
                    </div>

                    <!-- Кнопка оформления заказа -->
                    <button 
                      @click="showOrderForm = true"
                      class="w-full bg-primary text-white px-8 py-4 rounded-md hover:bg-primary/90 transition-colors mt-12 text-lg font-medium"
                    >
                      Оформить заказ
                    </button>
                  </div>
                </div>

                <!-- Табы -->
                <div class="mt-16">
                  <div class="flex border-b justify-around">
                    <button 
                      @click="activeTab = 'description'"
                      :class="['px-6 py-3 text-lg font-medium', activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    >
                      Описание
                    </button>
                    <button 
                      @click="activeTab = 'specifications'"
                      :class="['px-6 py-3 text-lg font-medium ml-8', activeTab === 'specifications' ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    >
                      Характеристики
                    </button>
                  </div>
                  
                  <div class="py-8">
                    <!-- Описание -->
                    <div v-if="activeTab === 'description'" class="text-gray-600 text-lg">
                      {{ selectedMattress?.description }}
                    </div>
                    
                    <!-- Характеристики -->
                    <div v-if="activeTab === 'specifications'" class="space-y-4">
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Материал:</span>
                        <span class="text-gray-600">Высококачественный пенополиуретан</span>
                      </div>
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Основание:</span>
                        <span class="text-gray-600">Независимые пружины</span>
                      </div>
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Жесткость:</span>
                        <span class="text-gray-600">Средняя</span>
                      </div>
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Гарантия:</span>
                        <span class="text-gray-600">2 года</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      </Transition>

      <!-- Форма оформления заказа -->
      <Transition name="modal-backdrop">
      <div v-if="showOrderForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
        <Transition name="modal">
          <div v-if="showOrderForm" class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-semibold">Оформление заказа</h3>
              <button @click="showOrderForm = false" class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Информация о выбранной конфигурации -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 class="font-medium mb-2">{{ selectedMattress?.title }}</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <p>Размер: {{ inquiryForm.size || 'Не выбран' }}</p>
                <p>Высота: {{ inquiryForm.height }} см</p>
                <p>Чехол: {{ covers.find(c => c.id === inquiryForm.cover)?.name }}</p>
              </div>
              <div class="mt-3 text-lg font-bold text-primary">
                {{ selectedMattress?.newPrice }}₽
              </div>
            </div>

            <form @submit.prevent="submitInquiry" class="space-y-4">
              <div>
                <label class="form-label">Имя</label>
                <input v-model="inquiryForm.name" type="text" required class="form-input"/>
              </div>
              <div>
                <label class="form-label">Телефон</label>
                <input v-model="inquiryForm.phone" type="tel" required class="form-input"/>
              </div>
              <button type="submit" class="w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
                Заказать
              </button>
            </form>
          </div>
        </Transition>
      </div>
      </Transition>
    </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';

const showModal = ref(false);
const showOrderForm = ref(false);
const selectedMattress = ref(null);
const inquiryForm = ref({
  name: '',
  phone: '',
  size: '',
  cover: 'basic',
  height: '20'
});

const activeTab = ref('description');

const covers = [
  { id: 'basic', name: 'Базовый чехол', price: 0 },
  { id: 'premium', name: 'Премиум чехол', price: 5000 }
];

const heights = [
  { value: '20', name: '20 см' },
  { value: '25', name: '25 см' },
  { value: '30', name: '30 см' }
];

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
    size: '',
    cover: 'basic',
    height: '20'
  };
};

const submitInquiry = () => {
  console.log('Form submitted:', {
    mattress: selectedMattress.value.title,
    ...inquiryForm.value
  });
  showModal.value = false;
  showOrderForm.value = false;
  inquiryForm.value = {
    name: '',
    phone: '',
    size: '',
    cover: 'basic',
    height: '20'
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
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input, .form-select {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary;
}

.form-radio {
  @apply appearance-none w-5 h-5 border-2 border-gray-300 rounded-full transition-all duration-200 cursor-pointer;
}

.form-radio:checked {
  @apply border-[6px] border-primary;
}

.form-radio:focus {
  @apply outline-none ring-2 ring-primary/20;
}

.form-radio:hover:not(:checked) {
  @apply border-primary/50;
}

.radio-group {
  @apply flex items-center gap-6;
}

.radio-group label {
  @apply flex items-center gap-2 cursor-pointer;
}

.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

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