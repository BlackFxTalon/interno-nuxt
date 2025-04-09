<script setup>
const props = defineProps({
  selectedItem: {
    type: [Object, Set, Map, Array],
    required: true,
  },
})

const emit = defineEmits(['handleOrderBtn'])

const activeTab = ref('specifications')

const showModal = defineModel()

const currentSize = defineModel('currentSize')

const price = ref(0)
const weight = ref(0)

// Следим за изменениями selectedItem
watch(() => props.selectedItem, (newItem) => {
  if (!newItem)
    return

  const firstPrice = Object.values(newItem.prices ?? {})[0] ?? 0
  const firstWeight = Object.values(newItem.weights ?? {})[0] ?? 0

  price.value = newItem.prices?.[currentSize.value] ?? firstPrice
  weight.value = newItem.weights?.[currentSize.value] ?? firstWeight
}, { deep: true })

// Следим за изменениями размера
watch(currentSize, (newSize) => {
  if (!newSize) {
    newSize = props.selectedItem.sizes[0]?.label || ''
  }
  if (props.selectedItem.prices && props.selectedItem.prices[newSize] !== undefined) {
    price.value = props.selectedItem.prices[newSize]
    weight.value = props.selectedItem.weights?.[newSize]
  }
  else {
    console.warn(`No price found for size ${newSize}`)
    price.value = 0
    weight.value = 0
  }
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

                  <p v-if="selectedItem.description" class="text-xl font-medium mb-4 mt-8">
                    {{ selectedItem.description }}
                  </p>

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
                    class="px-6 py-3 text-lg font-medium ml-8" :class="[activeTab === 'specifications'
                      ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    @click="activeTab = 'specifications'"
                  >
                    Характеристики
                  </button>
                  <button
                    class="px-6 py-3 text-lg font-medium" :class="[activeTab === 'advantages'
                      ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    @click="activeTab = 'advantages'"
                  >
                    Преимущества
                  </button>
                </div>

                <div class="py-8">
                  <div v-show="activeTab === 'specifications'" class="space-y-4">
                    <div v-if="weight" class="flex text-lg">
                      <p class="font-medium w-1/3">
                        Вес
                      </p>
                      <p class="text-gray-600">
                        {{ weight }} кг
                      </p>
                    </div>
                    <div v-if="selectedItem.height" class="flex text-lg">
                      <span class="font-medium w-1/3">Высота:</span>
                      <span class="text-gray-600">{{ selectedItem.height }} см</span>
                    </div>
                    <div v-if="selectedItem.depth" class="flex text-lg">
                      <span class="font-medium w-1/3">Толщина:</span>
                      <span class="text-gray-600">{{ selectedItem.depth }} см</span>
                    </div>
                    <div v-if="selectedItem.case" class="flex text-lg">
                      <p class="font-medium w-1/3">
                        Чехол:
                      </p>
                      <p class="text-gray-600">
                        {{ selectedItem.case }}
                      </p>
                    </div>
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
                  <div v-show="activeTab === 'advantages'" class="text-gray-600 text-lg">
                    <ul class="list-decimal grid gap-y-2">
                      <li
                        v-for="(advantage, index) in selectedItem.advantages"
                        :key="advantage + index"
                      >
                        {{ advantage }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <p class="text-xl font-medium mb-4 text-red-600">
                  Обращаем ваше внимание:
                </p>
                <p class="mb-4">
                  Новый матрас после вскрытия упаковки может иметь специфический, производственный запах.
                  Запах не вреден и не токсичен и со временем исчезне После снятия упаковки (пакетов) перед эксплуатацией изделие
                  необходимо проветрить в просторном помещении не менее 1 недели, чтобы удалить производственный запах.
                </p>
                <p class="mb-4">
                  Чистка пылесосом помогут быстрее устранить запах. В дневное время рекомендуется освободить матрас от постельных принадлежностей.
                </p>
                <p class="mb-4">
                  После соблюдения всех рекомендаций интенсивность запаха снизится, через 14 дней он станет минимальным.
                </p>
                <p class="mb-4">
                  Производитель оставляет за собой право менять рисунок стежки чехла; допуск по высоте составляет +- 1,5 см.
                  На изображении представлен образец, фактический внешний вид может отличаться от представленного на
                  изображении с сохранением всех заявленных технических характеристик, в т.ч. учитывая особенности цветопередачи,
                  ракурсов и иных условий съемки и воспроизведения изображения
                </p>
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
