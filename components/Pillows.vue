<template>
    <section class="py-16 pb-[3rem] bg-white" id="pillows">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Подушки</h2>
        <div class="splide pillows-slider" ref="splide">
        <div class="splide__track">
        <ul class="splide__list">
          <li class="splide__slide pb-[1rem]" v-for="(pillow, index) in pillows" :key="index">
            <div class="product-card">
              <img :src="pillow.image" :alt="pillow.title" class="card-image"/>
              <div class="card-content">
                <h3 class="text-2xl font-semibold mb-4">{{ pillow.title }}</h3>
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2 mb-4">
                    <span class="text-2xl font-bold text-primary">{{ pillow.newPrice }}₽</span>
                    <span class="text-md text-gray-400 line-through">{{ pillow.oldPrice }}₽</span>
                  </div>
                </div>
                <button 
                  @click="openInquiryForm(pillow)"
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
                    <img :src="selectedPillow?.image" :alt="selectedPillow?.title" class="w-full h-[600px] object-cover rounded-lg"/>
                  </div>
                  
                  <!-- Правая часть с информацией -->
                  <div class="w-1/2">
                    <h3 class="text-3xl font-semibold">{{ selectedPillow?.title }}</h3>
                    
                    <div class="flex items-center gap-3 mt-4">
                      <span class="text-4xl font-bold text-primary">{{ selectedPillow?.newPrice }}₽</span>
                      <span class="text-2xl text-gray-400 line-through">{{ selectedPillow?.oldPrice }}₽</span>
                    </div>

                    <!-- Размер -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Размер</h4>
                      <select 
                        v-model="inquiryForm.size"
                        required
                        class="form-select w-full text-lg"
                      >
                        <option value="">Выберите размер</option>
                        <option v-for="size in pillowSizes" :key="size.value" :value="size.value">
                          {{ size.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Наполнитель -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Наполнитель</h4>
                      <select 
                        v-model="inquiryForm.filling"
                        required
                        class="form-select w-full text-lg"
                      >
                        <option v-for="filling in fillingTypes" :key="filling.value" :value="filling.value">
                          {{ filling.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Жесткость -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Жесткость</h4>
                      <div class="radio-group">
                        <label v-for="firmness in firmnessLevels" :key="firmness.value">
                          <input
                            type="radio"
                            v-model="inquiryForm.firmness"
                            :value="firmness.value"
                            class="form-radio"
                          />
                          <span class="text-lg">{{ firmness.name }}</span>
                        </label>
                      </div>
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
                  <div class="flex border-b justify-between">
                    <button 
                      @click="activeTab = 'description'"
                      :class="['px-6 py-3 text-lg font-medium', activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    >
                      Описание
                    </button>
                    <button 
                      @click="activeTab = 'specifications'"
                      :class="['px-6 py-3 text-lg font-medium', activeTab === 'specifications' ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    >
                      Характеристики
                    </button>
                    <button 
                      @click="activeTab = 'care'"
                      :class="['px-6 py-3 text-lg font-medium', activeTab === 'care' ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    >
                      Уход
                    </button>
                  </div>
                  
                  <div class="py-8">
                    <!-- Описание -->
                    <div v-if="activeTab === 'description'" class="text-gray-600 text-lg">
                      {{ selectedPillow?.description }}
                    </div>
                    
                    <!-- Характеристики -->
                    <div v-if="activeTab === 'specifications'" class="space-y-4">
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Материал чехла:</span>
                        <span class="text-gray-600">100% хлопок</span>
                      </div>
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Наполнитель:</span>
                        <span class="text-gray-600">{{ fillingTypes.find(f => f.value === inquiryForm.filling)?.description }}</span>
                      </div>
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Гарантия:</span>
                        <span class="text-gray-600">1 год</span>
                      </div>
                    </div>

                    <!-- Уход -->
                    <div v-if="activeTab === 'care'" class="space-y-4">
                      <h4 class="text-xl font-medium mb-4">Рекомендации по уходу:</h4>
                      <ul class="list-disc list-inside space-y-2 text-lg text-gray-600">
                        <li>Стирка при температуре не выше 40°C</li>
                        <li>Не использовать отбеливатель</li>
                        <li>Сушить в горизонтальном положении</li>
                        <li>Регулярно проветривать</li>
                        <li>Не подвергать химической чистке</li>
                      </ul>
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
              <h4 class="font-medium mb-2">{{ selectedPillow?.title }}</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <p>Размер: {{ pillowSizes.find(s => s.value === inquiryForm.size)?.name || 'Не выбран' }}</p>
                <p>Наполнитель: {{ fillingTypes.find(f => f.value === inquiryForm.filling)?.name }}</p>
                <p>Жесткость: {{ firmnessLevels.find(f => f.value === inquiryForm.firmness)?.name }}</p>
              </div>
              <div class="mt-3 text-lg font-bold text-primary">
                {{ selectedPillow?.newPrice }}₽
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
import { ref, onMounted } from 'vue';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';

const showModal = ref(false);
const showOrderForm = ref(false);
const selectedPillow = ref(null);
const inquiryForm = ref({
  name: '',
  phone: '',
  size: '',
  filling: 'memory_foam',
  firmness: 'medium'
});

const activeTab = ref('description');

const pillowSizes = [
  { value: '50x70', name: '50 × 70 см' },
  { value: '70x70', name: '70 × 70 см' },
  { value: '40x60', name: '40 × 60 см' }
];

const fillingTypes = [
  { 
    value: 'memory_foam', 
    name: 'Memory Foam',
    description: 'Пена с эффектом памяти, адаптируется к форме головы и шеи'
  },
  { 
    value: 'latex', 
    name: 'Натуральный латекс',
    description: 'Экологичный материал с отличной поддержкой и вентиляцией'
  },
  { 
    value: 'bamboo', 
    name: 'Бамбуковое волокно',
    description: 'Гипоаллергенный наполнитель с антибактериальными свойствами'
  }
];

const firmnessLevels = [
  { value: 'soft', name: 'Мягкая' },
  { value: 'medium', name: 'Средняя' },
  { value: 'firm', name: 'Жесткая' }
];

const pillows = [
  {
    title: 'Подушка Memory Foam',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80',
    oldPrice: '4,999',
    newPrice: '3,999',
    description: 'Ортопедическая подушка с эффектом памяти для комфортного сна. Поддерживает правильное положение шеи и головы.'
  },
  {
    title: 'Подушка Premium Latex',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80',
    oldPrice: '6,999',
    newPrice: '5,999',
    description: 'Премиальная подушка из натурального латекса с отличной вентиляцией и антибактериальными свойствами.'
  },
  {
    title: 'Подушка Eco Comfort Bamboo',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80',
    oldPrice: '3,999',
    newPrice: '2,999',
    description: 'Экологичная подушка с бамбуковым наполнителем, гипоаллергенная и дышащая.'
  },
  {
    title: 'Подушка Cooling Gel',
    image: 'https://images.unsplash.com/photo-1592789705501-f9ae4278a9c9?auto=format&fit=crop&q=80',
    oldPrice: '5,999',
    newPrice: '4,999',
    description: 'Инновационная подушка с охлаждающим гелем для комфортного сна в любое время года.'
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

const openInquiryForm = (pillow) => {
  selectedPillow.value = pillow;
  showModal.value = true;
  inquiryForm.value = {
    name: '',
    phone: '',
    size: '',
    filling: 'memory_foam',
    firmness: 'medium'
  };
};

const submitInquiry = () => {
  console.log('Form submitted:', {
    pillow: selectedPillow.value.title,
    ...inquiryForm.value
  });
  showModal.value = false;
  showOrderForm.value = false;
  inquiryForm.value = {
    name: '',
    phone: '',
    size: '',
    filling: 'memory_foam',
    firmness: 'medium'
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

<style lang="scss" scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input, .form-select {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary;
}

.form-radio {
  @apply appearance-none w-5 h-5 border-2 border-gray-300 rounded-full 
         transition-all duration-200 cursor-pointer;
  
  &:checked {
    @apply border-[6px] border-primary;
  }
  
  &:focus {
    @apply outline-none ring-2 ring-primary/20;
  }
  
  &:hover:not(:checked) {
    @apply border-primary/50;
  }
}

.radio-group {
  @apply flex items-center gap-6;
  
  label {
    @apply flex items-center gap-2 cursor-pointer;
  }
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

/* Product Card */
.product-card {
  @apply relative rounded-lg shadow-lg overflow-hidden;
  height: 400px;
}

.card-image {
  @apply w-full h-full object-cover;
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