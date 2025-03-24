<script setup>
const props = defineProps({
  selectedItem: {
    type: [Object, Set, Map, Array],
    required: true,
  },
})

const emit = defineEmits(['handleSubmit'])

const showOrderForm = defineModel()

const currentSize = defineModel('currentSize')

const price = ref(0)
const weight = ref(0)

// Следим за изменениями selectedItem
watch(() => props.selectedItem, (newItem) => {
  // console.log('Selected item changed:', newItem)
  // console.log('currentSize', currentSize.value)
  price.value = Object.values(newItem.prices)[0]
  weight.value = Object.values(newItem.weights)[0]
}, { deep: true })

// Следим за изменениями размера
watch(currentSize, (newSize) => {
  // Если newSize пустой, берем первый доступный размер
  price.value = props.selectedItem.prices[newSize]
  weight.value = props.selectedItem.weights[newSize]
})

const orderForm = ref({
  name: '',
  phone: '',
})

function handleSubmit() {
  // console.log('Форма успешно отправлена:')
  // alert('Форма успешно отправлена:')
  emit('handleSubmit')
}
</script>

<template>
  <Transition name="modal-backdrop">
    <div v-if="showOrderForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <Transition name="modal">
        <div v-if="showOrderForm" class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-semibold">
              Оформление заказа
            </h3>
            <button class="text-gray-500 hover:text-gray-700" @click="showOrderForm = false">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <p class="font-medium mb-2">
              {{ selectedItem.name }}
            </p>
            <div class="mt-3 text-lg font-bold text-primary">
              {{ price }} ₽
            </div>
            <div class="text-sm text-gray-600 space-y-1">
              <p v-if="currentSize">
                <span class="font-semibold">Размер:</span> {{ currentSize }}
              </p>
              <p v-if="selectedItem.height">
                <span class="font-semibold">Высота:</span> {{ selectedItem.height }} см
              </p>
              <p v-if="weight">
                <span class="font-semibold">Вес:</span> {{ weight }} кг
              </p>
              <p v-if="selectedItem.foundation">
                <span class="font-semibold">Основание:</span> {{ selectedItem.foundation }}
              </p>
              <p v-if="selectedItem.firmness">
                <span class="font-semibold">Жесткость:</span> {{ selectedItem.firmness }}
              </p>
              <p v-if="selectedItem.side">
                <span class="font-semibold">Боковая сторона:</span> {{ selectedItem.side }}
              </p>
              <p v-if="selectedItem.case">
                <span class="font-semibold">Чехол:</span> {{ selectedItem.case }}
              </p>
              <p v-if="selectedItem.case">
                <span class="font-semibold">Гарантия:</span> 18 месяцев
              </p>
            </div>
          </div>
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div>
              <UiLabel>Имя</UiLabel>
              <UiInput
                v-model="orderForm.name"
                type="text"
                required
              />
            </div>
            <div>
              <UiLabel>Телефон</UiLabel>
              <UiInput
                v-model="orderForm.phone"
                type="tel"
                required
              />
            </div>
            <UiButton
              type="submit"
            >
              Заказать
            </UiButton>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
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
