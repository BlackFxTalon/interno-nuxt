<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event) => {
  const target = event.target
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :required="required"
    :value="modelValue"
    @input="handleInput"
    class="ui-input"
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
}
</style>
