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

const firmnessFilter = ref('')

async function applyFirmnessFilter() {
  try {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))

    const itemsArray = Array.isArray(props.itemsData)
      ? props.itemsData
      : Object.values(props.itemsData)

      if (!firmnessFilter.value || firmnessFilter.value === 'Все') {
        items.value = itemsArray
        return
      } else {
        items.value = itemsArray.filter(item => {
          if (!item.firmness) return false
          return item.firmness.toLowerCase() === firmnessFilter.value.toLowerCase()
        })
      }
      currentPage.value = 1
  } catch (error) {
    console.error('Ошибка при поиске:', error)
    items.value = Array.isArray(props.itemsData)
      ? props.itemsData
      : Object.values(props.itemsData)
  } finally {
    isLoading.value = false
  }
}

watch(firmnessFilter, () => applyFirmnessFilter())


async function handleSearchQuery(value) {
  try {
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
    return items
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
    image: item.image ?? null,
    sizes: item.sizes ?? null,
    prices: item.prices ?? null,
    weights: item.weights ?? null,
    height: item.height ?? null,
    depth: item.depth ?? null,
    foundation: item.foundation ?? null,
    materials: item.materials ?? null,
    firmness: item.firmness ?? null,
    case: item.case ?? null,
    side: item.side ?? null,
    pressure: item.pressure ?? null,
    packageCount: item.packageCount ?? null,
    foamColor: item.foamColor ?? null,
    width: item.width ?? null,
    length: item.length ?? null,
    compound: item.compound ?? null,
    textile: item.textile ?? null,
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
  <section class="py-8 md:py-16 pb-[3rem]">
    <div class="container mx-auto px-4">
      <div class="flex items-center flex-wrap xl:justify-start gap-4 mb-4 md:mb-8 xl:mb-12">
        <h2 class="text-2xl md:text-3xl font-bold">
          {{ title }}
        </h2>
        <div 
        class="flex flex-wrap gap-4 xl:ms-auto"
        >
        <div 
        class="flex flex-wrap items-center gap-4 w-full sm:w-auto"
        v-if="props.title === 'Матрасы' || props.title === 'Топперы'"
        >
          <p>По степени жёсткости:</p>
        <UiSelect
            class="sm:max-w-max"
            v-model="firmnessFilter"
          >
            <template #options>
              <option value="">Все</option>
              <option value="ниже средней жёсткости">Ниже средней</option>
              <option value="средняя жёсткость">Средняя</option>
              <option value="выше средней жёсткости">Выше средней</option>
            </template>
        </UiSelect>
       </div>
          <UiSelect
            class="sm:max-w-max"
            v-model="sortOrder"
            v-if="props.title === 'Матрасы'"
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
          <UiInput
            class="w-full xl:w-auto xl:max-w-max order-[-1]"
            type="text"
            placeholder="Поиск по названию"
            @change="(event) => handleSearchQuery(event.target.value)"
            v-if="props.title === 'Матрасы'"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-[repeat(3,_max-content)] gap-4 sm:gap-8 items-center justify-center">
        <ProductCard
          v-for="item in displayedItems"
          :key="item.id"
          :item="item"
          :card-class="props.title === 'Кровати' ? 'beds' : ''"
          @handle-btn="openModal(item)"
        />
      </div>

      <div v-if="hasMoreItems" class="text-center mt-8">
        <UiButton
          type="button"
          class="lg:max-w-max h-[48px] mx-auto"
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
