<script setup>
const props = defineProps({
  selectedItem: {
    type: [Object, Set, Map, Array],
    required: true,
  },
})

const emit = defineEmits(['handleOrderBtn'])

const activeTab = ref('description')

const showModal = defineModel()

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

watch(showModal, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style.overflow = ''
  }
})

function handleOrderBtn() {
  emit('handleOrderBtn')
}
</script>

<template>
  <Transition name="modal-backdrop">
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Transition name="modal">
        <div v-if="showModal" class="bg-white w-full h-full relative">
          <button
            class="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10"
            @click="showModal = false"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="h-full overflow-y-auto p-8">
            <div class="container mx-auto">
              <div class="flex justify-between items-start gap-12">
                <div class="w-1/2">
                  <NuxtImg
                    :src="selectedItem.image"
                    :alt="selectedItem.name"
                    format="webp"
                    class="w-full h-[600px]"
                  />
                </div>

                <div class="w-1/2">
                  <p class="text-3xl font-semibold">
                    {{ selectedItem.name }}
                  </p>

                  <div class="flex items-center gap-3 mt-4">
                    <p class="text-3xl font-semibold">
                      Цена:
                    </p>
                    <p class="text-4xl font-bold text-primary">
                      {{ price }} ₽
                    </p>
                  </div>

                  <div v-if="selectedItem.height" class="mt-8">
                    <p class="text-xl font-medium mb-4">
                      Высота:
                    </p>
                    <p class="text-xl font-medium">
                      {{ selectedItem.height }} см
                    </p>
                  </div>

                  <div class="mt-8">
                    <p class="text-xl font-medium mb-4">
                      Вес
                    </p>
                    <p class="text-xl font-medium">
                      {{ weight }} кг
                    </p>
                  </div>

                  <div v-if="selectedItem.case" class="mt-8">
                    <p class="text-xl font-medium mb-4">
                      Чехол:
                    </p>
                    <p class="text-xl font-medium mb-4">
                      {{ selectedItem.case }}
                    </p>
                  </div>

                  <div v-if="selectedItem.sizes" class="mt-8">
                    <p class="text-xl font-medium mb-4">
                      Размеры:
                    </p>
                    <UiSelect
                      v-model="currentSize"
                      class="w-full text-lg"
                    >
                      <template #options>
                        <option
                          v-for="selectedItemSize in selectedItem.sizes"
                          :key="selectedItemSize.id"
                          :value="selectedItemSize.label"
                        >
                          {{ selectedItemSize.label }}
                        </option>
                      </template>
                    </UiSelect>
                  </div>
                  <UiButton
                    type="button"
                    class="mt-8"
                    @click="handleOrderBtn"
                  >
                    Оформить заказ
                  </UiButton>
                </div>
              </div>

              <div class="mt-16">
                <div class="flex border-b justify-around">
                  <button
                    class="px-6 py-3 text-lg font-medium" :class="[activeTab === 'description'
                      ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    @click="activeTab = 'description'"
                  >
                    Описание
                  </button>
                  <button
                    class="px-6 py-3 text-lg font-medium ml-8" :class="[activeTab === 'specifications'
                      ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    @click="activeTab = 'specifications'"
                  >
                    Характеристики
                  </button>
                </div>

                <div class="py-8">
                  <div v-show="activeTab === 'description'" class="text-gray-600 text-lg">
                    {{ selectedItem.description }}
                  </div>

                  <div v-show="activeTab === 'specifications'" class="space-y-4">
                    <div v-if="selectedItem.materials" class="flex text-lg">
                      <p class="font-medium w-1/3">
                        Материалы:
                      </p>
                      <div class="flex flex-wrap">
                        <p class="text-gray-600">
                          {{ selectedItem.materials.join(', ') }}
                        </p>
                      </div>
                    </div>
                    <div v-if="selectedItem.foundation" class="flex text-lg">
                      <p class="font-medium w-1/3">
                        Основание:
                      </p>
                      <p class="text-gray-600">
                        {{ selectedItem.foundation }}
                      </p>
                    </div>
                    <div v-if="selectedItem.firmness" class="flex text-lg">
                      <span class="font-medium w-1/3">Жесткость:</span>
                      <span class="text-gray-600">{{ selectedItem.firmness }}</span>
                    </div>
                    <div v-if="selectedItem.side" class="flex text-lg">
                      <span class="font-medium w-1/3">Боковая сторона:</span>
                      <span class="text-gray-600">{{ selectedItem.side }}</span>
                    </div>
                    <div class="flex text-lg">
                      <span class="font-medium w-1/3">Гарантия:</span>
                      <span class="text-gray-600">18 месяцев</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
