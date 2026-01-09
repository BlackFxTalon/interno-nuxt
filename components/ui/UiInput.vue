<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

function handleInput(event) {
  const target = event.target
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    :type="props.type"
    :placeholder="props.placeholder"
    :required="props.required"
    :disabled="props.disabled"
    :name="props.name"
    :value="props.modelValue"
    class="ui-input"
    @input="handleInput"
  >
</template>

<style scoped lang="scss">
.ui-input {
  @apply w-full px-4 py-3 border-2 border-gray-200 rounded-lg
         bg-white text-gray-700
         transition-colors duration-200
         placeholder-gray-400
         focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 h-[40px];

    @media (max-width: 768px) {
        font-size: 14px;
    }

    &:disabled {
        @apply bg-gray-100 cursor-not-allowed opacity-60;
    }
}
</style>
