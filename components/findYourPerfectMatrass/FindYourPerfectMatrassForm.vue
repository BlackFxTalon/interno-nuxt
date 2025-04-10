<script setup>
const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
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

const name = defineModel('name', { type: String })

const phone = defineModel('phone', { type: String })

function handleClose() {
  emit('handleClose')
}

function handleSubmit() {
  emit('handleSubmit')
}
</script>

<template>
  <Transition name="modal-backdrop">
    <div v-if="props.showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Transition name="modal">
        <div
          v-if="props.showModal"
          class="grid grid-cols-1 md:grid-cols-2 auto-rows-max gap-x-[1rem] bg-white rounded-lg p-8 max-w-[49rem] w-full mx-4 max-h-[550px] overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        >
          <div class="flex justify-between items-center mb-4 col-[span_2]">
            <button class="text-gray-500 hover:text-gray-700 ml-auto" @click="handleClose">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="col-[span_2] md:col-[span_1]">
            <p class="text-xl xl:text-2xl font-semibold text-center">
              {{ props.matrassFormName }}
            </p>
            <NuxtImg
              :src="props.matrassFormImage"
              :alt="props.matrassFormName"
              loading="lazy"
              decoding="async"
              format="webp"
              class="w-full rounded-md col-[span_2]"
            />
            <p class="text-xl font-semibold">
              Цена:
              <span class="text-xl xl:text-2xl font-bold text-primary">{{ props.matrassFormPrice }}</span>
            </p>
          </div>
          <div class="space-y-4 my-8">
            <p
              class="font-semibold text-base"
            >
              Для более подробной информации заполните форму и наши специалисты свяжутся с вами
            </p>
            <form class="space-y-4" @submit.prevent="handleSubmit">
              <div>
                <UiLabel for="name">Имя</UiLabel>
                  <UiInput
                  v-model="name"
                  type="text"
                  id="name"
                  class="form-input"
                  required
                />
              </div>
              <div>
                <UiLabel for="phone">Телефон</UiLabel>
                  <UiInput
                  v-model="phone"
                  type="tel"
                  id="phone"
                  class="form-input"
                  required
                />
              </div>
              <UiButton
              type="submit"
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
