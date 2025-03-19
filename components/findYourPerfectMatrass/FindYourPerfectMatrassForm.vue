<template>
    <Transition name="modal-backdrop">
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
     <Transition name="modal">
      <div 
      v-if="showModal" 
      class="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[550px] overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <div class="flex justify-between items-center mb-4">
          <button @click="handleClose" class="text-gray-500 hover:text-gray-700 ml-auto">
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

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="form-group">
            <label class="form-label">Имя</label>
            <input 
              v-model="name"
              type="text" 
              required
              class="form-input"
            />
          </div>
          <div>
            <label class="form-label">Телефон</label>
            <input 
              v-model="phone"
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

const props = defineProps({
    showModal: {
        type: Boolean,
        required: true
    },
    matrassFormName: {
        type: String,
        required: true
    },
    matrassFormBudget: {
        type: String,
        required: true
    },
    matrassFormImage: {
        type: String,
        required: true
    }
});

const name = defineModel('name', { type: String });

const phone = defineModel('phone', { type: String });

const emit = defineEmits(['handleClose', 'handleSubmit']);

const handleClose = () => {
    emit('handleClose');
}

const handleSubmit = () => {
    emit('handleSubmit');
}

</script>

<style lang="scss" scoped>

</style>