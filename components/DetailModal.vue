<template>
    <Transition name="modal-backdrop">
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Transition name="modal">
          <div v-if="showModal" class="bg-white w-full h-full relative">
            <!-- Кнопка закрытия -->
            <button 
              @click="showModal = false" 
              class="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="h-full overflow-y-auto p-8">
              <div class="container mx-auto">
                <div class="flex justify-between items-start gap-12">
                  <!-- Левая часть с изображением -->
                  <div class="w-1/2">
                    <img :src="selectedMattress?.image" :alt="selectedMattress?.title" class="w-full h-[600px] object-cover rounded-lg"/>
                  </div>
                  
                  <!-- Правая часть с информацией -->
                  <div class="w-1/2">
                    <h3 class="text-3xl font-semibold">{{ selectedMattress?.title }}</h3>
                    
                    <div class="flex items-center gap-3 mt-4">
                      <span class="text-4xl font-bold text-primary">{{ selectedMattress?.newPrice }}₽</span>
                      <span class="text-2xl text-gray-400 line-through">{{ selectedMattress?.oldPrice }}₽</span>
                    </div>

                    <!-- Высота матраса -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Высота матраса</h4>
                      <div class="radio-group">
                        <label v-for="height in heights" :key="height.value">
                          <input 
                            type="radio" 
                            v-model="detailForm.height" 
                            :value="height.value"
                            class="form-radio"
                          />
                          <span class="text-lg">{{ height.name }}</span>
                        </label>
                      </div>
                    </div>

                    <!-- Чехол матраса -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Чехол матраса</h4>
                      <div class="radio-group">
                        <label v-for="cover in covers" :key="cover.id">
                          <input 
                            type="radio" 
                            v-model="detailForm.cover" 
                            :value="cover.id"
                            class="form-radio"
                          />
                          <span class="text-lg">{{ cover.name }} {{ cover.price > 0 ? `(+${cover.price}₽)` : '' }}</span>
                        </label>
                      </div>
                    </div>

                    <!-- Размер матраса -->
                    <div class="mt-8">
                      <h4 class="text-xl font-medium mb-4">Размер матраса</h4>
                      <select 
                        v-model="detailForm.size"
                        required
                        class="form-select w-full text-lg"
                      >
                        <option value="">Выберите размер</option>
                        <option value="twin">Twin (90 × 190)</option>
                        <option value="full">Full (140 × 190)</option>
                        <option value="queen">Queen (160 × 200)</option>
                        <option value="king">King (180 × 200)</option>
                      </select>
                    </div>

                    <!-- Кнопка оформления заказа -->
                    <button 
                      @click="showOrderForm = true"
                      class="primary-btn"
                    >
                      Оформить заказ
                    </button>
                  </div>
                </div>

                <!-- Табы -->
                <div class="mt-16">
                  <div class="flex border-b justify-around">
                    <button 
                      @click="activeTab = 'description'"
                      :class="['px-6 py-3 text-lg font-medium', activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    >
                      Описание
                    </button>
                    <button 
                      @click="activeTab = 'specifications'"
                      :class="['px-6 py-3 text-lg font-medium ml-8', activeTab === 'specifications' ? 'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    >
                      Характеристики
                    </button>
                  </div>
                  
                  <div class="py-8">
                    <!-- Описание -->
                    <div v-if="activeTab === 'description'" class="text-gray-600 text-lg">
                      {{ selectedMattress?.description }}
                    </div>
                    
                    <!-- Характеристики -->
                    <div v-if="activeTab === 'specifications'" class="space-y-4">
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Материал:</span>
                        <span class="text-gray-600">Высококачественный пенополиуретан</span>
                      </div>
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Основание:</span>
                        <span class="text-gray-600">Независимые пружины</span>
                      </div>
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Жесткость:</span>
                        <span class="text-gray-600">Средняя</span>
                      </div>
                      <div class="flex text-lg">
                        <span class="font-medium w-1/3">Гарантия:</span>
                        <span class="text-gray-600">2 года</span>
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

<script setup>

const activeTab = ref('description');

const showModal = defineModel();

const props = defineProps({
  selectedMattress: {
    type: [Object, Set, Map, Array],
    required: true
  }
});

const covers = [
  { id: 'basic', name: 'Базовый чехол', price: 0 },
  { id: 'premium', name: 'Премиум чехол', price: 5000 }
];

const heights = [
  { value: '20', name: '20 см' },
  { value: '25', name: '25 см' },
  { value: '30', name: '30 см' }
];

const detailForm = ref({
  name: '',
  phone: '',
  size: '',
  cover: 'basic',
  height: '20'
});

</script>

<style lang="scss" scoped>

</style>