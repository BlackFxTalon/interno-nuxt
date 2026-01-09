<script setup>
import { vTooltip } from 'floating-vue'
import ImageCarousel from '@/components/ImageCarousel.vue'
import OrderModal from '@/components/OrderModal.vue'
import RelatedProductsSlider from '@/components/RelatedProductsSlider.vue'
import 'floating-vue/dist/style.css'

const route = useRoute()
const router = useRouter()

const selectedItem = ref({})
const currentSize = ref('')
const currentColor = ref('')
const currentColorId = ref('')
const liftingMechanism = ref('')
const antivandalVelor = ref('')
const robotVacuumCleanerLegs = ref('')
const price = ref(0)
const weight = ref(0)
const activeTab = ref('specifications')
const imageCarouselRef = ref(null)
const showOrderForm = ref(false)
const currentImages = ref([])

// Get product data based on route params
const { data: productData } = await useFetch('/api/products')

// Function to determine product category
const getProductCategory = computed(() => {
  if (!productData.value)
    return 'beds'
  const productId = route.params.id
  if (productData.value.beds?.find(item => item.id === productId))
    return 'beds'
  if (productData.value.matrasses?.find(item => item.id === productId))
    return 'matrasses'
  if (productData.value.pillows?.find(item => item.id === productId))
    return 'pillows'
  if (productData.value.toppers?.find(item => item.id === productId))
    return 'toppers'

  return 'beds' // Default fallback
})

// Find the product by ID from the route
const product = computed(() => {
  if (!productData.value)
    return null

  // Search in all product categories
  const allProducts = [
    ...(productData.value.matrasses || []),
    ...(productData.value.beds || []),
    ...(productData.value.pillows || []),
    ...(productData.value.toppers || []),
  ]

  return allProducts.find(item => item.id === route.params.id)
})

// Set selectedItem when product is found
watch(product, (newProduct) => {
  if (newProduct) {
    selectedItem.value = newProduct
    if (newProduct.sizes && newProduct.sizes.length > 0) {
      currentSize.value = newProduct.sizes[0].label
    }
    if (newProduct.colors && newProduct.colors.length > 0) {
      currentColor.value = newProduct.colors[0].label
      currentColorId.value = newProduct.colors[0].id
      // Initialize images for first color
      generateColorImages(newProduct.colors[0].label)
    }
    else {
      // For products without colors (non-beds), use existing images
      currentImages.value = newProduct.images || []
    }
    if (newProduct.liftingMechanism && newProduct.liftingMechanism.length > 0) {
      liftingMechanism.value = newProduct.liftingMechanism[0]
    }
    if (newProduct.antivandalVelor && newProduct.antivandalVelor.length > 0) {
      antivandalVelor.value = newProduct.antivandalVelor[0]
    }
    if (newProduct.robotVacuumCleanerLegs && newProduct.robotVacuumCleanerLegs.length > 0) {
      robotVacuumCleanerLegs.value = newProduct.robotVacuumCleanerLegs[0]
    }
    // Set initial price and weight
    const firstPrice = Object.values(newProduct.prices ?? {})[0] ?? 0
    const firstWeight = Object.values(newProduct.weights ?? {})[0] ?? 0

    price.value = newProduct.prices?.[currentSize.value] ?? firstPrice
    weight.value = newProduct.weights?.[currentSize.value] ?? firstWeight
  }
}, { immediate: true })

// Watch for size changes
watch(currentSize, (newSize) => {
  if (!newSize || !selectedItem.value)
    return

  if (selectedItem.value.prices && selectedItem.value.prices[newSize] !== undefined) {
    price.value = selectedItem.value.prices[newSize]
    weight.value = selectedItem.value.weights?.[newSize]
  }
  else {
    console.warn(`No price found for size ${newSize}`)
    price.value = 0
    weight.value = 0
  }
})

watch(liftingMechanism, (newValue) => {
  if (newValue === 'Есть') {
    price.value += 3000
  }
  else {
    price.value -= 3000
  }
})

function handleColorChange(color) {
  // Handle both color object and color label string
  let colorLabel, colorId

  if (typeof color === 'string') {
    // If color is a string (from ImageCarousel), find the color object
    const colorObj = selectedItem.value?.colors?.find(c => c.label === color)
    if (colorObj) {
      colorLabel = colorObj.label
      colorId = colorObj.id
    }
    else {
      colorLabel = color
      colorId = ''
    }
  }
  else {
    // If color is an object (from color circle click)
    colorLabel = color.label
    colorId = color.id
  }

  // Only update if color actually changed
  if (currentColor.value === colorLabel) {
    return
  }

  currentColor.value = colorLabel
  currentColorId.value = colorId

  // Generate 3 images for the selected color (for beds)
  generateColorImages(colorLabel)
}

function handleOrderBtn() {
  // Navigate to order page or open order modal
  // You can implement this based on your requirements
  console.log('Order button clicked')
  showOrderForm.value = true
}

// Handle back button
function goBack() {
  router.back()
}

// Helper function to get view name for alt text
function getViewName(view) {
  const names = {
    aside: 'Вид сбоку',
    front: 'Вид спереди',
    lifting: 'Подъемный механизм',
  }
  return names[view] || view
}

// Function to generate 3 images for a specific color
function generateColorImages(colorLabel) {
  if (!selectedItem.value || !selectedItem.value.id)
    return

  const category = getProductCategory.value

  // Only beds get the 3-image slider
  if (category !== 'beds') {
    // For other products, use existing images
    currentImages.value = selectedItem.value.images || []
    return
  }

  // Convert camelCase ID to kebab-case for folder names (e.g., "ModernPlus" -> "modern-plus", "TerraLux2" -> "terra-lux-2")
  const bedId = selectedItem.value.id.replace(/([a-z])([A-Z\d])/g, '$1-$2').toLowerCase()
  const colorCode = colorLabel.replace('#', '')

  const views = ['aside', 'lifting', 'front']
  const generatedImages = views.map(view => ({
    id: `${bedId}-${colorCode}-${view}`,
    label: colorLabel,
    url: `/images/beds/${bedId}/${bedId}-${colorCode}-${view}.png`,
    alt: `${selectedItem.value.name} - ${getViewName(view)}`,
  }))

  currentImages.value = generatedImages
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header with back button -->
    <div class="container mx-auto px-4 py-4">
      <button
        class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        @click="goBack"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Назад
      </button>
    </div>

    <!-- Product Content -->
    <div v-if="selectedItem" class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row justify-between items-start gap-12">
        <div class="w-full lg:w-1/2">
          <ImageCarousel
            ref="imageCarouselRef"
            :images="currentImages"
            :show-thumbnails="true"
            height="400px"
            thumbnail-size="64px"
            :show-arrows="true"
            :show-pagination="false"
            class="max-w-[750px] mx-auto"
            @color-change="handleColorChange"
          />
        </div>

        <div class="w-full lg:w-1/2 flex flex-col space-y-4">
          <p class="text-xl lg:text-2xl font-semibold">
            {{ selectedItem.name }}
          </p>

          <div class="flex items-center gap-3 mt-4">
            <p class="text-sm lg:text-base font-semibold">
              Цена:
            </p>
            <p class="text-sm md:text-base font-bold text-primary">
              {{ price }} ₽
            </p>
          </div>

          <p v-if="selectedItem.description" class="text-sm md:text-base font-medium">
            {{ selectedItem.description }}
          </p>

          <div class="flex flex-col gap-2 space-y-4">
            <div v-if="selectedItem.sizes">
              <p class="text-sm md:text-base font-medium mb-4">
                Размеры:
              </p>
              <UiSelect
                v-model="currentSize"
                class="w-full text-sm md:text-base"
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
            <div v-if="selectedItem.colors">
              <p class="text-sm md:text-base font-medium mb-4">
                Цвет обивки:
              </p>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="color in selectedItem.colors"
                  :key="color.id"
                  v-tooltip="{ content: color.id, placement: 'top', distance: 10, delay: 0, triggers: ['hover'] }"
                  class="color w-6 h-6 rounded-full relative cursor-pointer"
                  :class="{ active: currentColor === color.label }"
                  :style="{ backgroundColor: color.label }"
                  @click="handleColorChange(color)"
                />
              </div>
            </div>
            <div v-if="selectedItem.liftingMechanism">
              <p class="text-sm md:text-base font-medium mb-4">
                Подъемный механизм:
              </p>
              <UiSelect
                v-model="liftingMechanism"
                class="w-full text-sm md:text-base"
              >
                <template #options>
                  <option
                    v-for="(liftingMechanismItem, index) in selectedItem.liftingMechanism"
                    :key="liftingMechanismItem + index"
                    :value="liftingMechanismItem"
                  >
                    {{ liftingMechanismItem }}
                  </option>
                </template>
              </UiSelect>
            </div>
            <div v-if="selectedItem.antivandalVelor">
              <p class="text-sm md:text-base font-medium mb-4">
                Антивандальный велюр:
              </p>
              <UiSelect
                v-model="antivandalVelor"
                class="w-full text-sm md:text-base"
              >
                <template #options>
                  <option
                    v-for="(antivandalVelorItem, index) in selectedItem.antivandalVelor"
                    :key="antivandalVelorItem + index"
                    :value="antivandalVelorItem"
                  >
                    {{ antivandalVelorItem }}
                  </option>
                </template>
              </UiSelect>
            </div>
            <div v-if="selectedItem.robotVacuumCleanerLegs">
              <p class="text-sm md:text-base font-medium mb-4">
                Ножки под робот-пылесос (13 см):
              </p>
              <UiSelect
                v-model="robotVacuumCleanerLegs"
                class="w-full text-sm md:text-base"
              >
                <template #options>
                  <option
                    v-for="(robotVacuumCleanerLegsItem, index) in selectedItem.robotVacuumCleanerLegs"
                    :key="robotVacuumCleanerLegsItem + index"
                    :value="robotVacuumCleanerLegsItem"
                  >
                    {{ robotVacuumCleanerLegsItem }}
                  </option>
                </template>
              </UiSelect>
            </div>
          </div>

          <UiButton
            type="button"
            class="mt-8 h-[48px]"
            @click="handleOrderBtn"
          >
            Оформить заказ
          </UiButton>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="mt-8 md:mt-16">
        <div class="flex border-b justify-around">
          <button
            class="px-6 py-3 text-sm md:text-base font-medium md:ml-2 lg:ml-4 xl:ml-8"
            :class="[activeTab === 'specifications'
              ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
            @click="activeTab = 'specifications'"
          >
            Характеристики
          </button>
          <button
            class="px-6 py-3 text-sm md:text-base font-medium"
            :class="[activeTab === 'advantages'
              ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
            @click="activeTab = 'advantages'"
          >
            Преимущества
          </button>
        </div>

        <div class="py-4 md:py-8">
          <div v-show="activeTab === 'specifications'" class="space-y-4">
            <div v-if="weight" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <p class="font-medium w-1/3">
                Вес
              </p>
              <p class="text-gray-600">
                {{ weight }} кг
              </p>
            </div>
            <div v-if="selectedItem.height" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <span class="font-medium w-1/3">Высота:</span>
              <span class="text-gray-600">{{ selectedItem.height }} см</span>
            </div>
            <div v-if="selectedItem.depth" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <span class="font-medium w-1/3">Толщина:</span>
              <span class="text-gray-600">{{ selectedItem.depth }} см</span>
            </div>
            <div v-if="selectedItem.width" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <span class="font-medium w-1/3">Ширина:</span>
              <span class="text-gray-600">{{ selectedItem.width }} см</span>
            </div>
            <div v-if="selectedItem.length" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <span class="font-medium w-1/3">Длина:</span>
              <span class="text-gray-600">{{ selectedItem.length }} см</span>
            </div>
            <div v-if="selectedItem.case" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <p class="font-medium w-1/3">
                Чехол:
              </p>
              <p class="text-gray-600">
                {{ selectedItem.case }}
              </p>
            </div>
            <div v-if="selectedItem.materials" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <p class="font-medium w-1/3">
                Материалы:
              </p>
              <div class="flex flex-wrap">
                <p class="text-gray-600">
                  {{ selectedItem.materials.join(', ') }}
                </p>
              </div>
            </div>
            <div v-if="selectedItem.foundation" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <p class="font-medium w-1/3">
                Основание:
              </p>
              <p class="text-gray-600">
                {{ selectedItem.foundation }}
              </p>
            </div>
            <div v-if="selectedItem.firmness" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <span class="font-medium w-1/3">Жесткость:</span>
              <span class="text-gray-600">{{ selectedItem.firmness }}</span>
            </div>
            <div v-if="selectedItem.side" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <span class="font-medium w-1/3">Боковая сторона:</span>
              <span class="text-gray-600">{{ selectedItem.side }}</span>
            </div>
            <div v-if="selectedItem.packageCount" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <span class="font-medium w-1/3">Кол-во в упаковке:</span>
              <span class="text-gray-600">{{ selectedItem.packageCount }}</span>
            </div>
            <div v-if="selectedItem.foamColor" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <span class="font-medium w-1/3">Цвет поролона:</span>
              <span class="text-gray-600">{{ selectedItem.foamColor }}</span>
            </div>
            <div v-if="selectedItem.compound" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <span class="font-medium w-1/3">Состав изделия:</span>
              <span class="text-gray-600">{{ selectedItem.compound }}</span>
            </div>
            <div v-if="selectedItem.textile" class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <span class="font-medium w-1/3">Ткань:</span>
              <span class="text-gray-600">{{ selectedItem.textile }}</span>
            </div>
            <div class="grid grid-cols-2 lg:flex text-sm md:text-base">
              <span class="font-medium w-1/3">Гарантия:</span>
              <span class="text-gray-600">18 месяцев</span>
            </div>
          </div>

          <div v-show="activeTab === 'advantages'" class="text-sm md:text-base">
            <ul class="list-disc grid gap-y-2 px-[2rem]">
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

      <!-- Additional Information -->
      <div class="space-y-4">
        <p class="text-lg md:text-xl font-medium mb-4 text-red-600">
          Обращаем ваше внимание:
        </p>
        <p>
          Новый матрас после вскрытия упаковки может иметь специфический, производственный запах.
          Запах не вреден и не токсичен и со временем исчезне После снятия упаковки (пакетов) перед эксплуатацией изделие
          необходимо проветрить в просторном помещении не менее 1 недели, чтобы удалить производственный запах.
        </p>
        <p>
          Чистка пылесосом помогут быстрее устранить запах. В дневное время рекомендуется освободить матрас от постельных принадлежностей.
        </p>
        <p>
          После соблюдения всех рекомендаций интенсивность запаха снизится, через 14 дней он станет минимальным.
        </p>
        <p>
          Производитель оставляет за собой право менять рисунок стежки чехла; допуск по высоте составляет +- 1,5 см.
          На изображении представлен образец, фактический внешний вид может отличаться от представленного на
          изображении с сохранением всех заявленных технических характеристик, в т.ч. учитывая особенности цветопередачи,
          ракурсов и иных условий съемки и воспроизведения изображения
        </p>
      </div>

      <!-- Related Products Section -->
      <RelatedProductsSlider
        :current-product-id="route.params.id"
        :product-data="productData"
        :category="getProductCategory"
      />
    </div>

    <!-- Loading or Not Found State -->
    <div v-else class="container mx-auto px-4 py-16 text-center">
      <div v-if="!product" class="text-gray-500">
        <p class="text-xl mb-4">
          Товар не найден
        </p>
        <button
          class="text-primary hover:underline"
          @click="goBack"
        >
          Вернуться назад
        </button>
      </div>
    </div>

    <OrderModal
      v-model="showOrderForm"
      :current-size="currentSize"
      :price="price"
      :name="selectedItem.name"
      :height="selectedItem.height"
      :weight="weight"
      :color="currentColorId"
      :lifting-mechanism="liftingMechanism"
      :antivandal-velor="antivandalVelor"
      :robot-vacuum-cleaner-legs="robotVacuumCleanerLegs"
    />
  </div>
</template>

<style lang="scss" scoped>
.color::before {
  content: "";
  border-radius: 50%;
  position: absolute;
  border: 1px solid #000;
  top: -4px;
  left: -4px;
  width: calc(100% + 8px);
  height: calc(100% + 8px);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.color.active::before {
   opacity: 1;
}
</style>
