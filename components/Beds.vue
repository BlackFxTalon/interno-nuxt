<template>
    <section class="py-16 pb-[3rem] bg-white" id="beds">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Кровати</h2>
        <div class="splide beds-slider" ref="splide">
        <div class="splide__track">
        <ul class="splide__list">
          <li class="splide__slide pb-[1rem]" v-for="(bed, index) in beds" :key="index">
            <div class="product-card">
              <img :src="bed.image" :alt="bed.title" class="card-image"/>
              <div class="card-content">
                <h3 class="text-2xl font-semibold mb-4">{{ bed.title }}</h3>
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2 mb-4">
                    <span class="text-2xl font-bold text-primary">{{ bed.newPrice }}₽</span>
                    <span class="text-md text-gray-400 line-through">{{ bed.oldPrice }}₽</span>
                  </div>
                </div>
                <button 
                  @click="openInquiryForm(bed)"
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
                    <img :src="selectedBeds?.image" :alt="selectedBeds?.title" class="w-full h-[600px] object-cover rounded-lg"/>
                  </div>
                  
                  <!-- Правая часть с информацией -->
                  <div class="w-1/2">
                    <h3 class="text-3xl font-semibold">{{ selectedBeds?.title }}</h3>
                    
                    <div class="flex items-center gap-3 mt-4">
                      <span class="text-4xl font-bold text-primary">{{ selectedBeds?.newPrice }}₽</span>
                      <span class="text-2xl text-gray-400 line-through">{{ selectedBeds?.oldPrice }}₽</span>
                    </div>

                    <!-- Материал обивки -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Материал обивки</h4>
                      <div class="space-y-3">
                        <label v-for="material in upholsteryMaterials" :key="material.id" class="flex items-center">
                          <input 
                            type="radio" 
                            v-model="inquiryForm.upholsteryMaterial" 
                            :value="material.id"
                            class="form-radio text-primary"
                          />
                          <span class="ml-2 text-lg">{{ material.name }}</span>
                        </label>
                      </div>
                    </div>

                    <!-- Цвет обивки -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Цвет обивки</h4>
                      <div class="colors-grid">
                        <label v-for="color in upholsteryColors" :key="color.id" class="color-option">
                          <input 
                            type="radio" 
                            v-model="inquiryForm.upholsteryColor" 
                            :value="color.id"
                            class="sr-only"
                          />
                          <span 
                            class="color-label"
                          >
                            <span 
                              class="color-circle"
                              :style="{ backgroundColor: color.color }"
                            ></span>
                            {{ color.name }}
                          </span>
                        </label>
                      </div>
                    </div>

                    <!-- Размер спального места -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Размер спального места</h4>
                      <select 
                        v-model="inquiryForm.bedSize"
                        required
                        class="form-select w-full text-lg"
                      >
                        <option value="">Выберите размер</option>
                        <option v-for="size in bedSizes" :key="size.value" :value="size.value">
                          {{ size.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Подъемный механизм -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Подъемный механизм</h4>
                      <select 
                        v-model="inquiryForm.liftingMechanism"
                        required
                        class="form-select w-full text-lg"
                      >
                        <option v-for="mechanism in liftingMechanisms" :key="mechanism.value" :value="mechanism.value">
                          {{ mechanism.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Антивандальный велюр -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Антивандальный велюр</h4>
                      <select 
                        v-model="inquiryForm.antiVandal"
                        required
                        class="form-select w-full text-lg"
                      >
                        <option v-for="option in antiVandalOptions" :key="option.value" :value="option.value">
                          {{ option.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Ножки под робот-пылесос -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Ножки под робот-пылесос</h4>
                      <select 
                        v-model="inquiryForm.robotLegs"
                        required
                        class="form-select w-full text-lg"
                      >
                        <option v-for="option in robotLegsOptions" :key="option.value" :value="option.value">
                          {{ option.name }}
                        </option>
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
                      @click="activeTab = 'legs'"
                      :class="['px-6 py-3 text-lg font-medium', activeTab === 'legs' ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    >
                      Варианты ножек
                    </button>
                    <button 
                      @click="activeTab = 'assembly'"
                      :class="['px-6 py-3 text-lg font-medium', activeTab === 'assembly' ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    >
                      Инструкция сборки
                    </button>
                    <button 
                      @click="activeTab = 'dimensions'"
                      :class="['px-6 py-3 text-lg font-medium', activeTab === 'dimensions' ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    >
                      Габариты
                    </button>
                  </div>
                  
                  <div class="py-8">
                    <!-- Описание -->
                    <div v-if="activeTab === 'description'" class="text-gray-600 text-lg">
                      {{ selectedBeds?.description }}
                    </div>
                    
                    <!-- Характеристики -->
                    <div v-if="activeTab === 'specifications'" class="space-y-4">
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Материал каркаса:</span>
                        <span class="text-gray-600">Массив дерева</span>
                      </div>
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Наполнитель:</span>
                        <span class="text-gray-600">Пенополиуретан повышенной плотности</span>
                      </div>
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Гарантия:</span>
                        <span class="text-gray-600">2 года</span>
                      </div>
                    </div>

                    <!-- Варианты ножек -->
                    <div v-if="activeTab === 'legs'" class="space-y-4">
                      <div class="grid grid-cols-2 gap-8">
                        <div>
                          <img src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80" alt="Стандартные ножки" class="rounded-lg mb-4">
                          <h4 class="text-lg font-medium">Стандартные ножки</h4>
                          <p class="text-gray-600">Высота: 5 см</p>
                        </div>
                        <div>
                          <img src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80" alt="Ножки для робота-пылесоса" class="rounded-lg mb-4">
                          <h4 class="text-lg font-medium">Ножки для робота-пылесоса</h4>
                          <p class="text-gray-600">Высота: 13 см</p>
                        </div>
                      </div>
                    </div>

                    <!-- Инструкция сборки -->
                    <div v-if="activeTab === 'assembly'" class="space-y-4">
                      <h4 class="text-xl font-medium mb-4">Этапы сборки:</h4>
                      <ol class="list-decimal list-inside space-y-2 text-lg text-gray-600">
                        <li>Распаковка и проверка комплектации</li>
                        <li>Сборка каркаса кровати</li>
                        <li>Установка подъемного механизма</li>
                        <li>Монтаж ламелей</li>
                        <li>Установка ножек</li>
                        <li>Финальная проверка</li>
                      </ol>
                    </div>

                    <!-- Габариты -->
                    <div v-if="activeTab === 'dimensions'" class="space-y-4">
                      <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80" alt="Габаритные размеры" class="rounded-lg mb-4">
                      <div class="grid grid-cols-2 gap-8">
                        <div>
                          <h4 class="text-lg font-medium mb-2">Внешние размеры:</h4>
                          <ul class="space-y-2 text-gray-600">
                            <li>Длина: 220 см</li>
                            <li>Ширина: 180 см</li>
                            <li>Высота изголовья: 130 см</li>
                            <li>Высота изножья: 40 см</li>
                          </ul>
                        </div>
                        <div>
                          <h4 class="text-lg font-medium mb-2">Размеры спального места:</h4>
                          <ul class="space-y-2 text-gray-600">
                            <li>160 × 200 см</li>
                            <li>180 × 200 см</li>
                            <li>200 × 200 см</li>
                          </ul>
                        </div>
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
              <h4 class="font-medium mb-2">{{ selectedBeds?.title }}</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <p>Материал обивки: {{ upholsteryMaterials.find(m => m.id === inquiryForm.upholsteryMaterial)?.name }}</p>
                <p>Цвет: {{ upholsteryColors.find(c => c.id === inquiryForm.upholsteryColor)?.name }}</p>
                <p>Размер: {{ bedSizes.find(s => s.value === inquiryForm.bedSize)?.name || 'Не выбран' }}</p>
                <p>Подъемный механизм: {{ liftingMechanisms.find(m => m.value === inquiryForm.liftingMechanism)?.name }}</p>
                <p>Антивандальный велюр: {{ antiVandalOptions.find(o => o.value === inquiryForm.antiVandal)?.name }}</p>
                <p>Ножки: {{ robotLegsOptions.find(o => o.value === inquiryForm.robotLegs)?.name }}</p>
              </div>
              <div class="mt-3 text-lg font-bold text-primary">
                {{ selectedBeds?.newPrice }}₽
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
const selectedBeds = ref(null);
const inquiryForm = ref({
  name: '',
  phone: '',
  upholsteryMaterial: 'velur',
  upholsteryColor: 'beige',
  bedSize: '',
  liftingMechanism: 'no',
  antiVandal: 'no',
  robotLegs: 'no'
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

const upholsteryMaterials = [
  { id: 'velur', name: 'Велюр' },
  { id: 'eco', name: 'Эко-кожа' },
  { id: 'textile', name: 'Текстиль' }
];

const upholsteryColors = [
  { id: 'beige', name: 'Бежевый', color: '#F5E6D3' },
  { id: 'gray', name: 'Серый', color: '#808080' },
  { id: 'brown', name: 'Коричневый', color: '#8B4513' },
  { id: 'blue', name: 'Синий', color: '#000080' }
];

const bedSizes = [
  { value: '160x200', name: '160 × 200 мм' },
  { value: '180x200', name: '180 × 200 мм' },
  { value: '200x200', name: '200 × 200 мм' }
];

const liftingMechanisms = [
  { value: 'no', name: 'Без механизма' },
  { value: 'standard', name: 'Стандартный' },
  { value: 'reinforced', name: 'Усиленный' }
];

const antiVandalOptions = [
  { value: 'no', name: 'Нет' },
  { value: 'yes', name: 'Да (+5000₽)' }
];

const robotLegsOptions = [
  { value: 'no', name: 'Стандартные ножки' },
  { value: 'yes', name: 'Ножки 13 см (+2000₽)' }
];

const beds = [
  {
    title: 'Кровать №1',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80',
    oldPrice: '1,299',
    newPrice: '899',
    description: 'Традиционный комфорт с передовой технологией пружин для превосходной поддержки. Имеет индивидуально обернутые пружины, которые минимизируют передачу движения и обеспечивают целевую поддержку вашего тела.'
  },
  {
    title: 'Кровать №2',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80',
    oldPrice: '1,799',
    newPrice: '1,299',
    description: 'Комфортное прилегание к телу для спокойного сна и снятия давления. Премиальная пена с эффектом памяти адаптируется к форме вашего тела, обеспечивая оптимальную поддержку и регуляцию температуры.'
  },
  {
    title: 'Кровать №3',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80',
    oldPrice: '1,999',
    newPrice: '1,499',
    description: 'Лучшее из двух миров с технологией пены с эффектом памяти и пружин. Сочетает в себе снятие давления пены с эффектом памяти с отзывчивой поддержкой карманных пружин.'
  },
  {
    title: 'Кровать №4',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80',
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

const openInquiryForm = (bed) => {
  selectedBeds.value = bed;
  showModal.value = true;
  inquiryForm.value = {
    name: '',
    phone: '',
    upholsteryMaterial: 'velur',
    upholsteryColor: 'beige',
    bedSize: '',
    liftingMechanism: 'no',
    antiVandal: 'no',
    robotLegs: 'no'
  };
};

const submitInquiry = () => {
  console.log('Form submitted:', {
    beds: selectedBeds.value.title,
    ...inquiryForm.value
  });
  showModal.value = false;
  showOrderForm.value = false;
  inquiryForm.value = {
    name: '',
    phone: '',
    upholsteryMaterial: 'velur',
    upholsteryColor: 'beige',
    bedSize: '',
    liftingMechanism: 'no',
    antiVandal: 'no',
    robotLegs: 'no'
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

.form-checkbox {
  @apply h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary;
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

.colors-grid {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.color-option {
  cursor: pointer;
}

.color-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.color-circle {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  border: 2px solid #e5e7eb;
  transition: border-color 0.2s;
}

.color-option input:checked + .color-label {
  background-color: #f3f4f6;
}

.color-option input:checked + .color-label .color-circle {
  border-color: #4f46e5;
}
</style>