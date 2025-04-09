<script setup>
import { computed, ref, watch } from 'vue'
import Loader from './Loader.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  itemsData: {
    type: [Object, Set, Array, Map],
    required: true,
  },
})

const isLoading = ref(false)
const showModal = ref(false)
const showOrderForm = ref(false)
const selectedItem = ref({})

const itemsPerPage = 6
const currentPage = ref(1)

const items = ref(props.itemsData)

async function handleSearchQuery(value) {
  try {
    // console.log('Received value:', value)
    // проверяем входящее значение

    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    const query = value?.toLowerCase().trim()
    // console.log('Search query:', query);
    // console.log('Original items:', props.itemsData);

    // Проверяем, что props.itemsData это массив
    const itemsArray = Array.isArray(props.itemsData)
      ? props.itemsData
      : Object.values(props.itemsData)

    // console.log('Items array:', itemsArray);

    if (!query) {
      items.value = itemsArray
    }
    else {
      const filteredItems = itemsArray.filter((item) => {
        return item.name.toLowerCase().includes(query)
      })

      // console.log('Filtered items:', filteredItems);
      items.value = filteredItems
    }

    currentPage.value = 1
  }
  catch (error) {
    console.error('Ошибка при поиске:', error)
    const defaultItems = Array.isArray(props.itemsData)
      ? props.itemsData
      : Object.values(props.itemsData)
    items.value = defaultItems
  }
  finally {
    isLoading.value = false
  }
}

const sortOrder = ref('')

function getMinPrice(item) {
  return Math.min(...Object.values(item.prices))
}

// Функция сортировки с обработкой ошибок
async function sortItems(items, order) {
  try {
    if (!order)
      return items

    if (order === '-price') {
      return [...items].sort((a, b) => {
        const priceA = getMinPrice(a)
        const priceB = getMinPrice(b)
        return priceA - priceB
      })
    }

    if (order === '+price') {
      return [...items].sort((a, b) => {
        const priceA = getMinPrice(a)
        const priceB = getMinPrice(b)
        return priceB - priceA
      })
    }
  }
  catch (error) {
    console.error(error)
    return items // Возвращаем несортированный массив в случае ошибки
  }
  finally {
    isLoading.value = true
  }
}

watch(sortOrder, async (newOrder) => {
  try {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    items.value = await sortItems(items.value, newOrder)
  }
  catch (error) {
    throw new Error(error)
  }
  finally {
    isLoading.value = false
  }
})

const displayedItems = computed(() => {
  return items.value.slice(0, currentPage.value * itemsPerPage)
})

const hasMoreItems = computed(() => {
  return displayedItems.value.length < items.value.length
})

async function loadMore() {
  try {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    currentPage.value++
  }
  catch (error) {
    throw new Error(error)
  }
  finally {
    isLoading.value = false
  }
}

const currentSize = ref('')

function openModal(item) {
  selectedItem.value = {
    id: item.id,
    name: item.name,
    description: item.description,
    advantages: item.advantages,
    image: item.image,
    sizes: item.sizes,
    prices: item.prices,
    weights: item.weights,
    height: item.height,
    depth: item.depth,
    foundation: item.foundation,
    materials: item.materials,
    firmness: item.firmness,
    case: item.case,
    side: item.side,
    pressure: item.pressure,
  }
  // console.log(selectedItem.value)
  if (item.sizes && item.sizes.length > 0) {
    currentSize.value = item.sizes[0].label
  }
  showModal.value = true
}

const openOrderModal = () => showOrderForm.value = true

function handleOrderSubmit() {
  showOrderForm.value = false
  showModal.value = false
}
</script>

<template>
  <section class="py-16 pb-[3rem]">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-start mb-12">
        <h2 class="text-3xl font-bold">
          {{ title }}
        </h2>
        <div class="flex gap-4 ms-auto">
          <UiInput
            class="max-w-max"
            type="text"
            placeholder="Поиск по названию"
            @change="(event) => handleSearchQuery(event.target.value)"
          />
          <UiSelect
            v-model="sortOrder"
          >
            <template #options>
              <option value="">
                По умолчанию
              </option>
              <option value="-price">
                Сначала дешевле
              </option>
              <option value="+price">
                Сначала дороже
              </option>
            </template>
          </UiSelect>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(3,_max-content)] gap-8 items-center justify-center">
        <ProductCard
          v-for="item in displayedItems"
          :key="item.id"
          :item="item"
          @handle-btn="openModal(item)"
        />
      </div>

      <div v-if="hasMoreItems" class="text-center mt-8">
        <UiButton
          type="button"
          class="max-w-max"
          @click="loadMore"
        >
          Показать еще
        </UiButton>
      </div>
    </div>

    <DetailModal
      v-model="showModal"
      v-model:current-size="currentSize"
      :selected-item="selectedItem"
      @handle-order-btn="openOrderModal"
    />

    <OrderModal
      v-model="showOrderForm"
      v-model:current-size="currentSize"
      :selected-item="selectedItem"
      @handle-submit="handleOrderSubmit"
    />

    <Teleport to="#teleports">
      <Loader
        v-model="isLoading"
      />
    </Teleport>
  </section>
</template>

<style scoped>
</style>
