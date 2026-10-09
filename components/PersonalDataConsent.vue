<script setup lang="ts">
import { CONSENT_DOCUMENT_PATH } from '~/utils/consent'

const props = defineProps<{
  id: string
  disabled?: boolean
}>()
const accepted = defineModel<boolean>({ default: false })
</script>

<template>
  <div class="space-y-2 text-sm text-gray-700">
    <label :for="props.id" class="flex items-start gap-3 cursor-pointer">
      <input
        :id="props.id"
        v-model="accepted"
        type="checkbox"
        name="personal-data-consent"
        required
        :disabled="props.disabled"
        :aria-describedby="`${props.id}-details`"
        class="mt-1 h-4 w-4 shrink-0 accent-primary"
      >
      <span>
        Даю
        <NuxtLink :to="CONSENT_DOCUMENT_PATH" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2">
          согласие на обработку персональных данных
        </NuxtLink>
        ООО «Интерно» для обработки этой заявки и связи со мной.
      </span>
    </label>
    <p :id="`${props.id}-details`" class="text-xs text-gray-500">
      <NuxtLink to="/policy" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2">
        Политика обработки данных
      </NuxtLink>.
      Email необязателен. Это не согласие на рекламную рассылку.
      После отметки загрузится Яндекс SmartCaptcha для защиты формы от спама.
      Этот внешний сервис может использовать cookies Яндекса.
    </p>
  </div>
</template>
