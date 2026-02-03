<script setup>
const props = defineProps({
  matrassFormName: {
    type: String,
    required: true,
  },
  matrassFormPrice: {
    type: String,
    required: true,
  },
  matrassFormImage: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['handleClose', 'handleSubmit'])

const showModal = defineModel('showModal', { type: Boolean })

const findMatrassForm = ref({
  name: '',
  email: '',
  phone: '',
})

const {
  isLoading,
  submitStatus,
  errorMessage,
  resetFormState,
  submitForm,
} = useFormSubmit({
  showModal,
  captchaContainerId: 'captcha-container-find-matrass-form',
  successModal: {
    title: 'Спасибо!',
    message: 'Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.',
  },
})

function resetForm() {
  findMatrassForm.value = {
    name: '',
    email: '',
    phone: '',
  }
  resetFormState()
}

function handleClose() {
  emit('handleClose')
}

async function handleSubmit() {
  const success = await submitForm(findMatrassForm.value)
  if (success) {
    resetForm()
  }
}
</script>

<template>
  <Transition name="modal-backdrop">
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Transition name="modal">
        <div
          v-if="showModal"
          class="grid grid-cols-1 md:grid-cols-2 auto-rows-max gap-x-[1rem] bg-white rounded-lg p-8 max-w-[49rem] w-full mx-4 max-h-full lg:max-h-[550px] overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        >
          <div class="flex justify-between items-center mb-4 col-[span_2]">
            <p class="text-base sm:text-xl font-semibold text-center">
              {{ props.matrassFormName }}
            </p>
            <button class="text-gray-500 hover:text-gray-700 ml-auto" @click="handleClose">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="col-[span_2] md:col-[span_1]">
            <NuxtImg
              :src="props.matrassFormImage"
              :alt="props.matrassFormName"
              loading="lazy"
              decoding="async"
              format="webp"
              class="w-full max-w-[150px] h-[150px] md:max-w-[300px] md:h-auto mx-auto rounded-md col-[span_2]"
            />
            <p class="text-sm sm:text-base font-semibold">
              Цена:
              <span class="text-primary">{{ props.matrassFormPrice }}</span>
            </p>
          </div>
          <div class="space-y-4 md:my-8">
            <!-- <p
              class="text-sm sm:text-base font-semibold"
            >
              Для более подробной информации заполните форму и наши специалисты свяжутся с вами
            </p> -->
            <form
              action="#"
              method="post"
              class="space-y-4 mt-4 md:mt-0"
              @submit.prevent="handleSubmit"
            >
              <!-- Сообщение об ошибке -->
              <div
                v-if="submitStatus === 'error'"
                class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
              >
                <p class="font-medium">
                  {{ errorMessage || 'Произошла ошибка. Попробуйте позже.' }}
                </p>
              </div>

              <div class="form-group">
                <UiLabel for="name">
                  Имя
                </UiLabel>
                <UiInput
                  id="name"
                  v-model="findMatrassForm.name"
                  placeholder="Введите ваше имя"
                  required
                  :disabled="isLoading"
                />
              </div>
              <div class="form-group">
                <UiLabel for="email">
                  Email
                </UiLabel>
                <UiInput
                  id="email"
                  v-model="findMatrassForm.email"
                  placeholder="Введите вашу почту"
                  type="email"
                  required
                  :disabled="isLoading"
                />
              </div>
              <div class="form-group">
                <UiLabel for="phone">
                  Телефон
                </UiLabel>
                <UiInput
                  id="phone"
                  v-model="findMatrassForm.phone"
                  v-maska="'+7(9##)###-##-##'"
                  placeholder="+7(9XX)XXX-XX-XX"
                  required
                  :disabled="isLoading"
                />
              </div>
              <ClientOnly>
                <div class="form-group">
                  <div
                    id="captcha-container-find-matrass-form"
                    style="min-height: 100px"
                  />
                </div>
              </ClientOnly>
              <UiButton
                class="h-[48px]"
                type="submit"
                :disabled="isLoading"
              >
                Отправить
              </UiButton>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>

</style>
