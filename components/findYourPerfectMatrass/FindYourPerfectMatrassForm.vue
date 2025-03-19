<template>
    <Transition name="modal-backdrop">
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
     <Transition name="modal">
      <div 
      v-if="showModal" 
      class="grid grid-cols-2 auto-rows-max gap-x-[1rem] bg-white rounded-lg p-8 max-w-[49rem] w-full mx-4 max-h-[550px] overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <div class="flex justify-between items-center mb-4 col-[span_2]">
          <button @click="handleClose" class="text-gray-500 hover:text-gray-700 ml-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>
          <h3 class="text-2xl font-semibold text-center">{{ matrassFormName }}</h3>
            <NuxtImg 
            :src="matrassFormImage" 
            :alt="matrassFormName"
            loading="lazy" 
            decoding="async"
            format="webp"
            class="w-full rounded-md"
            />
            <p class="text-xl font-semibold">
              Цена:
              <span class="text-2xl font-bold text-primary">{{ matrassFormPrice }}</span>
            </p>
        </div>
        <div class="space-y-4 my-8">
          <p 
          class="font-semibold text-base">
          Для более подробной информации заполните форму и наши специалисты свяжутся с вами
          </p>
          <form @submit.prevent="handleSubmit" class="space-y-4">
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
              class="primary-btn"
            >
              Отправить
            </button>
          </form>
         </div>
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
    matrassFormPrice: {
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