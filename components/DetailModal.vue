<template>
    <Transition name="modal-backdrop">
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Transition name="modal">
          <div v-if="showModal" class="bg-white w-full h-full relative">
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
                  <div class="w-1/2">
                    <NuxtImg 
                    :src="selectedItem.image" 
                    :alt="selectedItem.name"
                    format="webp"
                    class="w-full h-[600px] object-cover rounded-lg"
                    />
                  </div>
                  
                  <div class="w-1/2">
                    <p class="text-3xl font-semibold">{{ selectedItem.name }}</p>
                    
                    <div class="flex items-center gap-3 mt-4">
                      <p class="text-3xl font-semibold">Цена:</p>
                      <p class="text-4xl font-bold text-primary">{{ selectedItemPrice }} ₽</p>
                    </div>

                    <div class="mt-8" v-if="selectedItem.height">
                      <p class="text-xl font-medium mb-4">Высота матраса:</p>
                      <p class="text-xl font-medium">{{ selectedItem.height }} см</p>
                    </div>

                    <div class="mt-8" v-if="selectedItem.case">
                      <p class="text-xl font-medium mb-4">Чехол матраса:</p>
                      <p class="text-xl font-medium mb-4">{{ selectedItem.case }}</p>
                    </div>

                    <div class="mt-8" v-if="selectedItem.sizes">
                      <h4 class="text-xl font-medium mb-4">Размеры:</h4>
                      <select 
                        v-model="currentSize"
                        required
                        class="form-select w-full text-lg"
                      >
                      <option 
                      v-for="selectedItemSize in selectedItem.sizes"
                      :value="selectedItemSize.label"
                      >
                      {{ selectedItemSize.label }}
                      </option>
                      </select>
                    </div>

                    <button 
                      @click="showOrderForm = true"
                      class="primary-btn"
                    >
                      Оформить заказ
                    </button>
                  </div>
                </div>

                <div class="mt-16">
                  <div class="flex border-b justify-around">
                    <button 
                      @click="activeTab = 'description'"
                      :class="['px-6 py-3 text-lg font-medium', activeTab === 'description' ? 
                      'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    >
                      Описание
                    </button>
                    <button 
                      @click="activeTab = 'specifications'"
                      :class="['px-6 py-3 text-lg font-medium ml-8', activeTab === 'specifications' ? 
                      'text-primary border-b-2 border-primary' : 'text-gray-500']"
                    >
                      Характеристики
                    </button>
                  </div>
                  
                  <div class="py-8">
                    <div v-show="activeTab === 'description'" class="text-gray-600 text-lg">
                      {{ selectedItem.description }}
                    </div>
                    
                    <div v-show="activeTab === 'specifications'" class="space-y-4">
                      <div class="flex text-lg" v-if="selectedItem.materials">
                        <p class="font-medium w-1/3">Материалы:</p>
                        <div class="flex flex-wrap">
                          <p class="text-gray-600" 
                          v-for="material in selectedItem.materials">
                            {{ material }}
                          </p>
                        </div>
                      </div>
                      <div class="flex text-lg" v-if="selectedItem.foundation">
                        <p class="font-medium w-1/3">Основание:</p>
                        <p class="text-gray-600">{{ selectedItem.foundation }}</p>
                      </div>
                      <div class="flex text-lg" v-if="selectedItem.">
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

const props = defineProps({
  selectedItem: {
    type: [Object, Set, Map, Array],
    required: true
  }
});

const activeTab = ref('description');

const showModal = defineModel();

const selectedItemPrice = ref(selectedItem.prices["80x190"]);

const currentSize = ref(selectedItem.sizes[0].label);


// const detailForm = ref({
//   name: '',
//   phone: '',
//   size: '',
//   cover: 'basic',
//   height: '20'
// });

</script>

<style lang="scss" scoped>

</style>