<script setup lang="ts">
import { CONSENT_DOCUMENT_PATH, CONSENT_VERSION } from '~/utils/consent'

useHead({ link: [{ rel: 'canonical', href: `https://internomebel.ru${CONSENT_DOCUMENT_PATH}` }] })
</script>

<template>
  <StaticContentPage :slug="`consent-${CONSENT_VERSION}`" />
</template>
