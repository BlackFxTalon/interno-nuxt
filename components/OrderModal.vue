<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currentSize: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    default: null,
  },
  weight: {
    type: Number,
    default: null,
  },
  color: {
    type: String,
    default: null,
  },
  liftingMechanism: {
    type: String,
    default: null,
  },
  antivandalVelor: {
    type: String,
    default: null,
  },
  robotVacuumCleanerLegs: {
    type: String,
    default: null,
  },
})

const showOrderForm = defineModel()



const orderForm = ref({
  name: '',
  email: '',
  phone: '',
})

const closeForm = () => {
  showOrderForm.value = false
  orderForm.value = {
    name: '',
    email: '',
    phone: '',
  }
}

function handleSubmit() {
  console.log(orderForm.value);
  showOrderForm.value = false
  orderForm.value = {
    name: '',
    email: '',
    phone: '',
  }
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
            <button class="text-gray-500 hover:text-gray-700" @click="closeForm">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <p class="text-base md:text-lg font-medium mb-2">
              {{ props.name }}
            </p>
            <div class="mt-3 text-sm md:text-base font-bold text-primary">
              {{ props.price }} ₽
            </div>
            <div class="text-sm md:text-base text-gray-600 space-y-1">
              <p v-if="props.currentSize">
                <span class="font-semibold">Размер:</span> {{ props.currentSize }}
              </p>
              <p v-if="props.height">
                <span class="font-semibold">Высота:</span> {{ props.height }} см
              </p>
              <p v-if="props.weight">
                <span class="font-semibold">Вес:</span> {{ props.weight }} кг
              </p>
              <p v-if="props.color">
                <span class="font-semibold">Цвет:</span> {{ props.color }}
              </p>
              <p v-if="props.liftingMechanism">
                <span class="font-semibold">Подъемный механизм:</span> {{ props.liftingMechanism }}
              </p>
              <p v-if="props.antivandalVelor">
                <span class="font-semibold">Антивандальный велюр:</span> {{ props.antivandalVelor }}
              </p>
              <p v-if="props.robotVacuumCleanerLegs">
                <span class="font-semibold">Ножки под робот-пылесос (13 см):</span> {{ props.robotVacuumCleanerLegs }}
              </p>
            </div>
          </div>
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div class="form-group">
              <UiLabel for="orderFormName">Имя</UiLabel>
              <UiInput
                v-model="orderForm.name"
                id="orderFormName"
                placeholder="Введите ваше имя"
                type="text"
                required
              />
            </div>
            <div class="form-group">
                <UiLabel for="orderFormEmail">Email</UiLabel>
                <UiInput
                  v-model="orderForm.email"
                  placeholder="Введите вашу почту"
                  id="orderFormEmail"
                  type="email"
                  required
                />
              </div>
              <div class="form-group">
                <UiLabel for="orderFormPhone">Телефон</UiLabel>
                <UiInput
                  v-model="orderForm.phone"
                  v-maska="'+7(9##)###-##-##'"
                  placeholder="+7(9XX)XXX-XX-XX"
                  id="orderFormPhone"
                  required
                />
              </div>
            <UiButton
              class="h-[48px]"
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
