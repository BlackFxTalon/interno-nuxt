<template>
    <section class="py-16 pb-[3rem] bg-white" id="children-beds">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Детские кровати</h2>
        <div class="splide children-beds-slider" ref="splide">
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
                    <img :src="selectedBed?.image" :alt="selectedBed?.title" class="w-full h-[600px] object-cover rounded-lg"/>
                  </div>
                  
                  <!-- Правая часть с информацией -->
                  <div class="w-1/2">
                    <h3 class="text-3xl font-semibold">{{ selectedBed?.title }}</h3>
                    
                    <div class="flex items-center gap-3 mt-4">
                      <span class="text-4xl font-bold text-primary">{{ selectedBed?.newPrice }}₽</span>
                      <span class="text-2xl text-gray-400 line-through">{{ selectedBed?.oldPrice }}₽</span>
                    </div>

                    <!-- Размер спального места -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Размер спального места</h4>
                      <div class="select-container">
                        <select 
                          v-model="inquiryForm.bedSize"
                          required
                          class="form-select"
                        >
                          <option value="" disabled>Выберите размер</option>
                          <option v-for="size in bedSizes" :key="size.value" :value="size.value">
                            {{ size.name }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <!-- Материал -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Материал</h4>
                      <div class="select-container">
                        <select 
                          v-model="inquiryForm.material"
                          required
                          class="form-select"
                        >
                          <option v-for="material in materials" :key="material.value" :value="material.value">
                            {{ material.name }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <!-- Цвет -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Цвет</h4>
                      <div class="colors-grid">
                        <label v-for="color in colors" :key="color.id" class="color-option">
                          <input 
                            type="radio" 
                            v-model="inquiryForm.color" 
                            :value="color.id"
                            class="sr-only"
                          />
                          <span class="color-label">
                            <span 
                              class="color-circle"
                              :style="{ backgroundColor: color.color }"
                            ></span>
                            {{ color.name }}
                          </span>
                        </label>
                      </div>
                    </div>

                    <!-- Дополнительные опции -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Дополнительные опции</h4>
                      <div class="checkbox-group">
                        <label>
                          <input 
                            type="checkbox" 
                            v-model="inquiryForm.hasDrawers"
                            class="form-checkbox"
                          />
                          <span class="text-lg">Ящики для хранения (+5000₽)</span>
                        </label>
                        <label>
                          <input 
                            type="checkbox" 
                            v-model="inquiryForm.hasSafetyRails"
                            class="form-checkbox"
                          />
                          <span class="text-lg">Защитные бортики (+2000₽)</span>
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
                      @click="activeTab = 'safety'"
                      :class="['px-6 py-3 text-lg font-medium', activeTab === 'safety' ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    >
                      Безопасность
                    </button>
                  </div>
                  
                  <div class="py-8">
                    <!-- Описание -->
                    <div v-if="activeTab === 'description'" class="text-gray-600 text-lg">
                      {{ selectedBed?.description }}
                    </div>
                    
                    <!-- Характеристики -->
                    <div v-if="activeTab === 'specifications'" class="space-y-4">
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Материал каркаса:</span>
                        <span class="text-gray-600">{{ materials.find(m => m.value === inquiryForm.material)?.description }}</span>
                      </div>
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Максимальная нагрузка:</span>
                        <span class="text-gray-600">100 кг</span>
                      </div>
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Гарантия:</span>
                        <span class="text-gray-600">2 года</span>
                      </div>
                    </div>

                    <!-- Безопасность -->
                    <div v-if="activeTab === 'safety'" class="space-y-4">
                      <h4 class="text-xl font-medium mb-4">Стандарты безопасности:</h4>
                      <ul class="list-disc list-inside space-y-2 text-lg text-gray-600">
                        <li>Закругленные углы для предотвращения травм</li>
                        <li>Экологически чистые материалы</li>
                        <li>Устойчивая конструкция</li>
                        <li>Надежные крепления</li>
                        <li>Соответствие европейским стандартам безопасности</li>
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
              <h4 class="font-medium mb-2">{{ selectedBed?.title }}</h4>
              <div class="text-sm text-gray-600 space-y-1">
                <p>Размер: {{ bedSizes.find(s => s.value === inquiryForm.bedSize)?.name || 'Не выбран' }}</p>
                <p>Материал: {{ materials.find(m => m.value === inquiryForm.material)?.name }}</p>
                <p>Цвет: {{ colors.find(c => c.id === inquiryForm.color)?.name }}</p>
                <p v-if="inquiryForm.hasDrawers">Ящики для хранения: Да</p>
                <p v-if="inquiryForm.hasSafetyRails">Защитные бортики: Да</p>
              </div>
              <div class="mt-3 text-lg font-bold text-primary">
                {{ calculateTotalPrice }}₽
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
import { ref, onMounted, computed } from 'vue';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';

const showModal = ref(false);
const showOrderForm = ref(false);
const selectedBed = ref(null);
const inquiryForm = ref({
  name: '',
  phone: '',
  bedSize: '',
  material: 'pine',
  color: 'white',
  hasDrawers: false,
  hasSafetyRails: false
});

const activeTab = ref('description');

const bedSizes = [
  { value: '80x160', name: '80 × 160 см' },
  { value: '90x190', name: '90 × 190 см' },
  { value: '90x200', name: '90 × 200 см' }
];

const materials = [
  { 
    value: 'pine', 
    name: 'Сосна',
    description: 'Натуральная сосна, экологически чистый материал'
  },
  { 
    value: 'beech', 
    name: 'Бук',
    description: 'Прочный бук с красивой текстурой'
  },
  { 
    value: 'oak', 
    name: 'Дуб',
    description: 'Премиальный дуб, долговечный и надежный'
  }
];

const colors = [
  { id: 'white', name: 'Белый', color: '#FFFFFF' },
  { id: 'beige', name: 'Бежевый', color: '#F5E6D3' },
  { id: 'pink', name: 'Розовый', color: '#FFB6C1' },
  { id: 'blue', name: 'Голубой', color: '#87CEEB' }
];

const beds = [
  {
    title: 'Детская кровать Сказка',
    image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&q=80',
    oldPrice: '29,999',
    newPrice: '24,999',
    description: 'Уютная детская кровать с безопасными бортиками и возможностью установки ящиков для хранения. Идеально подходит для детей от 3 лет.'
  },
  {
    title: 'Кровать-чердак Мечта',
    image: 'https://images.unsplash.com/photo-1618220048045-10a6dbdf83e0?auto=format&fit=crop&q=80',
    oldPrice: '45,999',
    newPrice: '39,999',
    description: 'Многофункциональная кровать-чердак с рабочей зоной и шкафом. Оптимальное решение для небольших комнат.'
  },
  {
    title: 'Кровать Принцесса',
    image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?auto=format&fit=crop&q=80',
    oldPrice: '34,999',
    newPrice: '29,999',
    description: 'Элегантная кровать для маленьких принцесс с декоративным балдахином и мягким изголовьем.'
  },
  {
    title: 'Кровать Юный капитан',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80',
    oldPrice: '39,999',
    newPrice: '34,999',
    description: 'Стильная кровать в морском стиле с удобными ящиками для хранения и встроенным столиком.'
  }
];

const calculateTotalPrice = computed(() => {
  let basePrice = parseInt(selectedBed.value?.newPrice.replace(/,/g, '')) || 0;
  if (inquiryForm.value.hasDrawers) basePrice += 5000;
  if (inquiryForm.value.hasSafetyRails) basePrice += 2000;
  return basePrice.toLocaleString();
});

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
  selectedBed.value = bed;
  showModal.value = true;
  inquiryForm.value = {
    name: '',
    phone: '',
    bedSize: '',
    material: 'pine',
    color: 'white',
    hasDrawers: false,
    hasSafetyRails: false
  };
};

const submitInquiry = () => {
  console.log('Form submitted:', {
    bed: selectedBed.value.title,
    ...inquiryForm.value,
    totalPrice: calculateTotalPrice.value
  });
  showModal.value = false;
  showOrderForm.value = false;
  inquiryForm.value = {
    name: '',
    phone: '',
    bedSize: '',
    material: 'pine',
    color: 'white',
    hasDrawers: false,
    hasSafetyRails: false
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
  @apply appearance-none w-5 h-5 border-2 border-gray-300 rounded 
         transition-all duration-200 cursor-pointer;
  
  &:checked {
    @apply bg-primary border-primary;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  }
  
  &:focus {
    @apply outline-none ring-2 ring-primary/20;
  }
  
  &:hover:not(:checked) {
    @apply border-primary/50;
  }
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

.checkbox-group {
  @apply flex flex-col gap-3;
  
  label {
    @apply flex items-center gap-2 cursor-pointer;
  }
}

</style> 