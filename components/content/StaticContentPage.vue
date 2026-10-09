<script setup lang="ts">
const props = defineProps<{
  slug: string
}>()

const { data: page } = await useAsyncData(`content-page-${props.slug}`, () => {
  return queryCollection('pages')
    .where('slug', '=', props.slug)
    .first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Content page "${props.slug}" not found`,
  })
}

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description,
})
</script>

<template>
  <main class="min-h-screen bg-gray-50 py-8 md:py-16">
    <article class="container mx-auto px-4">
      <div class="content-page mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-lg md:p-10">
        <ContentRenderer
          v-if="page"
          :value="page"
        />
      </div>
    </article>
  </main>
</template>

<style scoped>
.content-page :deep(h1) {
  color: #111827;
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.content-page :deep(h2) {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 2rem 0 1rem;
}

.content-page :deep(h3) {
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 700;
  margin: 1.5rem 0 0.75rem;
}

.content-page :deep(p),
.content-page :deep(li) {
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.75;
}

.content-page :deep(p + p) {
  margin-top: 1rem;
}

.content-page :deep(ul),
.content-page :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.content-page :deep(ul) {
  list-style: disc;
}

.content-page :deep(ol) {
  list-style: decimal;
}

.content-page :deep(a) {
  color: #0580c7;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.content-page :deep(strong) {
  color: #1f2937;
  font-weight: 700;
}
</style>
