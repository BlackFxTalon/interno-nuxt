<script setup>
import { CheckCircle } from 'lucide-vue-next'
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Успешно!',
  },
  message: {
    type: String,
    default: 'Операция выполнена успешно.',
  },
})

const emit = defineEmits(['update:show', 'close'])

function closeModal() {
  emit('update:show', false)
  emit('close')
}

function updateBodyOverflow(isOpen) {
  if (import.meta.client && document?.body) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
}

watch(() => props.show, (isOpen) => {
  updateBodyOverflow(isOpen)
})

onMounted(() => {
  if (props.show) {
    updateBodyOverflow(true)
  }
})

onUnmounted(() => {
  updateBodyOverflow(false)
})
</script>

<template>
  <Transition name="modal-backdrop">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
      @click.self="closeModal"
    >
      <Transition name="modal">
        <div
          v-if="show"
          class="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center"
        >
          <div class="flex justify-center mb-4">
            <CheckCircle
              :size="64"
              class="text-green-500"
              stroke-width="1.5"
            />
          </div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-2">
            {{ title }}
          </h3>
          <p class="text-gray-600 mb-6">
            {{ message }}
          </p>
          <UiButton
            class="h-[48px]"
            @click="closeModal"
          >
            Закрыть
          </UiButton>
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
