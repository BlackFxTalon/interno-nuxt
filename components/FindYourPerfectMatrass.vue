<template>
    <!-- Find Your Perfect Mattress Section -->
    <section class="py-24 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h1 class="text-4xl font-bold mb-4">Найдите свой идеальный матрас</h1>
          <p class="text-xl text-gray-600">Позвольте нам помочь вам подобрать идеальный матрас для вашего стиля сна.</p>
        </div>
        
        <div class="max-w-4xl mx-auto">
          <!-- Sleeping Position -->
          <div class="mb-16">
            <h2 class="text-2xl font-semibold mb-8 text-center">Какая поза для сна вам больше всего нравится?</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                @click="selectMatrass('side')"
                :class="[
                  'p-8 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-6 hover:shadow-lg',
                  selectedPosition === 'side' 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-gray-100 hover:border-primary/30'
                ]"
              >
                <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg class="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 18V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M9 12H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <span class="text-lg font-medium">Спальное место на боку</span>
              </button>

              <button 
                @click="selectMatrass('back')"
                :class="[
                  'p-8 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-6 hover:shadow-lg',
                  selectedPosition === 'back' 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-gray-100 hover:border-primary/30'
                ]"
              >
                <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg class="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 18V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <span class="text-lg font-medium">Спальное место на спине</span>
              </button>

              <button 
                @click="selectMatrass('stomach')"
                :class="[
                  'p-8 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-6 hover:shadow-lg',
                  selectedPosition === 'stomach' 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-gray-100 hover:border-primary/30'
                ]"
              >
                <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg class="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 18V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <span class="text-lg font-medium">Спальное место на животе</span>
              </button>
            </div>
          </div>

          <!-- Budget Range -->
          <div class="mb-16">
            <h3 class="text-2xl font-semibold mb-8 text-center">Каков ваш бюджет?</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                v-for="range in budgetRanges" 
                :key="range"
                @click="selectBudget(range)"
                :class="[
                  'py-4 px-6 rounded-xl border-2 transition-all duration-300 text-center hover:shadow-lg',
                  selectedBudget === range 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-gray-100 hover:border-primary/30'
                ]"
              >
                <span class="text-lg font-medium">{{ range }}</span>
              </button>
            </div>
          </div>

          <!-- Find Button -->
          <button 
            @click="findMattress"
            class="w-full bg-primary text-white py-5 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
          >
             Найти мой идеальный матрас
          </button>
        </div>
      </div>
    </section>

    <Transition name="modal-backdrop">
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
     <Transition name="modal">
      <div v-if="showModal" class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <button @click="closeMatrassForm" class="text-gray-500 hover:text-gray-700 ml-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mb-6">
          <h3 class="text-2xl font-semibold text-center mb-4">Ваш идеальный выбор это: {{ matrassFormName }}</h3>
          <img class="w-full rounded-md" loading="lazy" decoding="async" :src="matrassFormImage" alt="image" width="100" height="100">
          <div class="flex items-center gap-2 mt-3">
            <span class="text-2xl font-bold text-primary">{{ matrassFormBudget }}</span>
          </div>
        </div>

        <p class="mb-6 font-semibold">Для более подробной информации заполните форму и наши специалисты свяжутся с вами</p>

        <form @submit.prevent="submitInquiry" class="space-y-6">
          <div class="form-group">
            <label class="form-label">Имя</label>
            <input 
              v-model="findMatrassForm.name"
              type="text" 
              required
              class="form-input"
            />
          </div>
          <div>
            <label class="form-label">Телефон</label>
            <input 
              v-model="findMatrassForm.phone"
              type="tel" 
              required
              class="form-input"
            />
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
import { ref, computed } from 'vue';



// Mattress finder data
const selectedPosition = ref(null);
const selectedBudget = ref(null);
const budgetRanges = ['500₽-1000₽', '1000₽-1500₽', '1500₽-2000₽', '2000+'];

const matrassFormName = computed(() => {
    if(selectedPosition.value === 'side' && selectedBudget.value === '500₽-1000₽') {
        return 'Матрас №1';
    }
    if(selectedPosition.value === 'back' && selectedBudget.value === '1000₽-1500₽') {
        return 'Матрас №2';
    }
    if(selectedPosition.value === 'stomach' && selectedBudget.value === '1500₽-2000₽') {
        return 'Матрас №3';
    }
    if(
    (selectedPosition.value === 'stomach' || selectedPosition.value === 'back' || selectedPosition.value === 'side') 
    && selectedBudget.value === '2000+') {
        return 'Матрас №4';
    }

    return 'Матрас №1';
});

const matrassFormImage = computed(() => {
    if(selectedPosition.value === 'side' && selectedBudget.value === '500₽-1000₽') {
        return 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80';
    }
    if(selectedPosition.value === 'back' && selectedBudget.value === '1000₽-1500₽') {
        return 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80';
    }
    if(selectedPosition.value === 'stomach' && selectedBudget.value === '1500₽-2000₽') {
        return 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80';
    }
    if(
    (selectedPosition.value === 'stomach' || selectedPosition.value === 'back' || selectedPosition.value === 'side') 
    && selectedBudget.value === '2000+') {
        return 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80';
    }

    return 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80';
});

const matrassFormBudget = computed(() => {
    if(selectedPosition.value === 'side' && selectedBudget.value === '500₽-1000₽') {
        return '899₽';
    }
    if(selectedPosition.value === 'back' && selectedBudget.value === '1000₽-1500₽') {
        return '1,299₽';
    }
    if(selectedPosition.value === 'stomach' && selectedBudget.value === '1500₽-2000₽') {
        return '1,499₽';
    }
    if(
    (selectedPosition.value === 'stomach' || selectedPosition.value === 'back' || selectedPosition.value === 'side') 
    && selectedBudget.value === '2000+') {
        return '2,499₽';
    }

    return '899₽';
});

const selectMatrass = (matrass) => {
  selectedPosition.value = matrass;
};

const selectBudget = (budget) => {
  selectedBudget.value = budget;
};

const showModal = ref(false);
const findMatrassForm = ref({
  name: '',
  phone: '',
});

const openMatrassForm = () => {
  showModal.value = true;
  findMatrassForm.value = {
    name: '',
    phone: ''
  };
};

const findMattress = () => {
  if (!selectedPosition.value || !selectedBudget.value) {
    alert('Пожалуйста, выберите положение для сна и бюджет.');
    return;
  }

  openMatrassForm();

};

const closeMatrassForm = () => {
  showModal.value = false;
  findMatrassForm.value = {
    name: '',
    phone: ''
  };
  selectedPosition.value = null;
  selectedBudget.value = null;
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

</style>