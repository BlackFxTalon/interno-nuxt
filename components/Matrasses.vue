<template>
    <section class="py-16 pb-[3rem] bg-gray-50" id="mattresses">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Матрасы</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(3,_max-content)] gap-8 items-center justify-center">
            <ProductCard
            v-for="(mattress, index) in displayedMattresses" 
            :key="index"
            :mattress="mattress"
            @handleBtn="openModal(mattress)"
            />
        </div>
        
        <div class="text-center mt-8" v-if="hasMoreMattresses">
          <button 
            @click="loadMore"
            class="primary-btn max-w-max"
          >
            Показать еще
          </button>
        </div>
      </div>

      <!-- Inquiry Form Modal -->
      
      <DetailModal
      v-model="showModal"
      :selectedMattress="selectedMattress"
      />

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
import { ref, computed } from 'vue';

const showModal = ref(false);
const showOrderForm = ref(false);
const selectedMattress = ref({});
const itemsPerPage = 6;
const currentPage = ref(1);

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

const displayedMattresses = computed(() => {
  return mattresses.slice(0, currentPage.value * itemsPerPage);
});

const hasMoreMattresses = computed(() => {
  return displayedMattresses.value.length < mattresses.length;
});

const loadMore = () => {
  currentPage.value++;
};

const openModal = (mattress) => {
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
</style>