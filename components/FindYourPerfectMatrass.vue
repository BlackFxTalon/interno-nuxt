<template>
    <!-- Find Your Perfect Mattress Section -->
    <section class="py-24 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">Найдите свой идеальный матрас</h2>
          <p class="text-xl text-gray-600">Позвольте нам помочь вам подобрать идеальный матрас для вашего стиля сна.</p>
        </div>

        <div class="max-w-4xl mx-auto">
          <!-- Slides Container -->
          <div class="relative overflow-hidden">
            <div class="transition-all duration-300 flex"
              :style="{ transform: `translateX(-${currentStep * 100}%)` }"
            >
              <!-- Dynamic Steps -->
              <div v-for="(step, index) in mattressData.steps" 
                :key="step.id"
                class="w-full flex-shrink-0"
              >
                <h2 class="text-2xl font-semibold mb-8 text-center">{{ step.title }}</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    v-for="option in step.options"
                    :key="option.id"
                    @click="selectOption(step.id, option.id)"
                    :class="[
                      'p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-4 hover:shadow-lg',
                      selections[step.id] === option.id
                        ? 'border-primary bg-primary/5 shadow-lg' 
                        : 'border-gray-100 hover:border-primary/30'
                    ]"
                  >
                    <span class="text-lg font-medium text-center">{{ option.label }}</span>
                    <span v-if="option.size" class="text-sm text-gray-500">{{ option.size }}</span>
                  </button>
                </div>
              </div>

              <!-- Final Step: Recommendation -->
              <div class="w-full flex-shrink-0">
                <h3 class="text-2xl font-semibold mb-8 text-center">Ваш идеальный выбор</h3>
                <div class="text-center">
                  <h4 class="text-xl mb-4">{{ recommendedMattress?.name }}</h4>
                  <img 
                    :src="recommendedMattress?.image" 
                    alt="Матрас" 
                    class="w-full max-w-md mx-auto rounded-lg mb-4"
                  >
                  <p class="text-2xl font-bold text-primary mb-8">{{ recommendedMattress?.price }}</p>
                  <button 
                    @click="openMatrassForm"
                    class="bg-primary text-white py-4 px-8 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Оформить заказ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FindYourPerfectMatrassForm
    :show-modal="showModal"
    :matrass-form-budget="matrassFormBudget"
    :matrass-form-image="matrassFormImage"
    :matrass-form-name="matrassFormName"
    v-model:name="findMatrassForm.name"
    v-model:phone="findMatrassForm.phone"
    @handleClose="closeMatrassForm"
    @handleSubmit="submitForm"
    />
</template>

<script setup>
import { ref, computed } from 'vue';
import mattressData from '/data/mattress-data.json';

const currentStep = ref(0);
const selections = ref({});
const showModal = ref(false);

const findMatrassForm = ref({
  name: '',
  phone: '',
});

const selectOption = (stepId, optionId) => {
  selections.value[stepId] = optionId;
  setTimeout(() => {
    if (currentStep.value < mattressData.steps.length) {
      currentStep.value++;
    }
  }, 300);
};

const recommendedMattress = computed(() => {
  // Логика подбора матраса на основе selections
  return mattressData.recommendations.find(mattress => {
    // Реализуйте логику сопоставления выборов пользователя
    // с рекомендациями из базы данных
    return true; // Временная заглушка
  });
});

const matrassFormName = computed(() => {
  const option = mattressData.mattressOptions.find(opt => 
    (opt.position === selectedPosition.value || opt.position === '*') && 
    opt.budget === selectedBudget.value
  );
  return option?.name || 'Матрас №1';
});

const matrassFormImage = computed(() => {
  const option = mattressData.mattressOptions.find(opt => 
    (opt.position === selectedPosition.value || opt.position === '*') && 
    opt.budget === selectedBudget.value
  );
  return option?.image || mattressData.mattressOptions[0].image;
});

const matrassFormBudget = computed(() => {
  const option = mattressData.mattressOptions.find(opt => 
    (opt.position === selectedPosition.value || opt.position === '*') && 
    opt.budget === selectedBudget.value
  );
  return option?.price || mattressData.mattressOptions[0].price;
});

const canProceed = computed(() => {
  if (currentStep.value === 0) return selectedPosition.value;
  if (currentStep.value === 1) return selectedBudget.value;
  return true;
});

const openMatrassForm = () => {
  showModal.value = true;
};

const resetForm = () => {
  currentStep.value = 0;
  selectedPosition.value = null;
  selectedBudget.value = null;
};

const closeMatrassForm = () => {
  showModal.value = false;
  findMatrassForm.value = {
    name: '',
    phone: ''
  };
  resetForm();
};

const submitForm = () => {
  closeMatrassForm();
  alert('Заявка успешно отправлена!');
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
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>