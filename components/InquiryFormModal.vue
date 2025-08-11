<template>
    <Transition name="modal-backdrop">
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Transition name="modal">
          <div v-if="showModal" class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-2xl font-semibold">
                Оформить заказ
              </h3>
              <button class="text-gray-500 hover:text-gray-700" @click="showModal = false">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form action="#" method="post" class="space-y-6" @submit.prevent="submitInquiry">
              <div class="form-group">
                <UiLabel for="inquiryFormName">Имя</UiLabel>
                <UiInput
                  v-model="inquiryForm.name"
                  placeholder="Введите ваше имя"
                  id="inquiryFormName"
                  type="text"
                  required
                />
              </div>
              <div class="form-group">
                <UiLabel for="inquiryFormEmail">Email</UiLabel>
                <UiInput
                  v-model="inquiryForm.email"
                  placeholder="Введите вашу почту"
                  id="inquiryFormEmail"
                  type="email"
                  required
                />
              </div>
              <div class="form-group">
                <UiLabel for="inquiryFormPhone">Телефон</UiLabel>
                <UiInput
                  v-model="inquiryForm.phone"
                  v-maska="'+7(9##)###-##-##'"
                  placeholder="+7(9XX)XXX-XX-XX"
                  id="inquiryFormPhone"
                  required
                />
              </div>
              <UiButton
                type="submit"
                class="h-[48px]"
              >
                Отправить
              </UiButton>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const showModal = defineModel('showModal');

const inquiryForm = ref({
  name: '',
  email: '',
  phone: '',
})

function submitInquiry() {
//   console.log('Форма отправлена:', inquiryForm.value)
  showModal.value = false
}

watch(showModal, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    inquiryForm.value = {
      name: '',
      email: '',
      phone: '',
    }
  }
  else {
    document.body.style.overflow = ''
    inquiryForm.value = {
      name: '',
      email: '',
      phone: '',
    }
  }
})
</script>

<style lang="scss" scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary;
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