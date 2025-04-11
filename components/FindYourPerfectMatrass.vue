<script setup>
import { computed, ref } from 'vue'
import mattressSteps from '/data/mattress-steps.json'

const currentStep = ref(0)
const selections = ref({})
const showModal = ref(false)

const findMatrassForm = ref({
  name: '',
  phone: '',
})

function selectOption(stepId, optionId) {
  selections.value[stepId] = optionId
  if (currentStep.value < mattressSteps.steps.length) {
    currentStep.value++
  }
}

const currentBudgetOptions = computed(() => {
  const budgetStep = mattressSteps.steps.find(step => step.id === 'budget')
  return selections.value.forWhom ? budgetStep.options[selections.value.forWhom] : []
})

const recommendedMattress = computed(() => {
  if (!selections.value.forWhom || !selections.value.firmness
    || !selections.value.size || !selections.value.budget) {
    return null
  }

  return mattressSteps.recommendations.find((mattress) => {
    return mattress.matches.forWhom.includes(selections.value.forWhom)
      && mattress.matches.firmness === selections.value.firmness
      && mattress.matches.budget === selections.value.budget
  })
})

const recommendedMattressName = computed(() => {
  return recommendedMattress.value?.name || ''
})

const recommendedMattressDescription = computed(() => {
  return recommendedMattress.value?.description || ''
})

const recommendedMattressImage = computed(() => {
  return recommendedMattress.value?.image || ''
})

const recommendedMattressPrice = computed(() => {
  if (!recommendedMattress.value || !selections.value.size) {
    return ''
  }
  return recommendedMattress.value.prices[selections.value.size]
})

function openMatrassForm() {
  showModal.value = true
}

function resetForm() {
  currentStep.value = 0
  selections.value = {}
}

function closeMatrassForm() {
  showModal.value = false
  findMatrassForm.value = {
    name: '',
    phone: '',
  }
  resetForm()
}

function submitForm() {
  closeMatrassForm()
  // alert('Заявка успешно отправлена!')
}

watch(showModal, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <!-- Find Your Perfect Mattress Section -->
  <section class="py-8 md:py-16 xl:py-24 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-4 md:mb-8">
        <h2 class="text-2xl xl:text-3xl font-bold">
          Подберите идеальный матрас для вашего сна.
        </h2>
      </div>

      <div class="max-w-4xl mx-auto">
        <!-- Slides Container -->
        <div class="relative overflow-hidden">
          <div
            class="transition-all duration-300 flex"
            :style="{ transform: `translateX(-${currentStep * 100}%)` }"
          >
            <!-- Dynamic Steps -->
            <div
              v-for="step in mattressSteps.steps"
              :key="step.id"
              class="w-full flex-shrink-0"
            >
              <p class="text-xl font-semibold mb-8 text-center">
                {{ step.title }}
              </p>
              <div
                class="grid grid-cols-2 gap-4"
                :class="{
                  'md:grid-cols-3': step.id === 'firmness' || step.id === 'budget',
                  'md:grid-cols-4': step.id === 'size',
                }"
              >
                <template v-if="step.id === 'budget'">
                  <button
                    v-for="option in currentBudgetOptions"
                    :key="option.id"
                    class="p-3 md:p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-4 hover:shadow-lg" :class="[
                      selections[step.id] === option.id
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-gray-100 hover:border-primary/30',
                    ]"
                    @click="selectOption(step.id, option.id)"
                  >
                    <span class="font-medium text-center">{{ option.label }}</span>
                  </button>
                </template>
                <template v-else>
                  <button
                    v-for="option in step.options"
                    :key="option.id"
                    class="p-3 md:p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-4 hover:shadow-lg" :class="[
                      selections[step.id] === option.id
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-gray-100 hover:border-primary/30',
                    ]"
                    @click="selectOption(step.id, option.id)"
                  >
                    <span class="font-medium text-center">{{ option.label }}</span>
                    <span v-if="option.size" class="text-sm text-gray-500">{{ option.size }}</span>
                  </button>
                </template>
              </div>
            </div>

            <!-- Final Step: Recommendation -->
            <div class="w-full flex-shrink-0">
              <p class="md:text-xl mb-4 text-center">
                Ваш идеальный выбор:
              </p>
              <p class="md:text-xl mb-4 font-semibold text-center">
                {{ recommendedMattressName }}
              </p>
              <div class="grid gap-4 grid-cols-1 md:grid-cols-2 items-center">
                <NuxtImg
                  :src="recommendedMattressImage"
                  :alt="recommendedMattressName"
                  format="webp"
                  class="w-full max-w-[300px] mx-auto rounded-lg mb-4"
                />
                <div class="space-y-4">
                  <p class="text-base md:text-lg font-semibold">
                    {{ recommendedMattressDescription }}
                  </p>
                  <p class="text-base md:text-lg font-semibold">
                    Цена:
                    <span class="text-base md:text-lg font-bold text-primary">{{ recommendedMattressPrice }}</span>
                  </p>
                </div>
              </div>
              <div class="text-center">
                <UiButton
                  type="button"
                  class="max-w-max h-[48px] mx-auto"
                  @click="openMatrassForm"
                >
                  Оформить заказ
                </UiButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <FindYourPerfectMatrassForm
    v-model:name="findMatrassForm.name"
    v-model:phone="findMatrassForm.phone"
    :show-modal="showModal"
    :matrass-form-price="recommendedMattressPrice"
    :matrass-form-image="recommendedMattressImage"
    :matrass-form-name="recommendedMattressName"
    @handle-close="closeMatrassForm"
    @handle-submit="submitForm"
  />
</template>

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
