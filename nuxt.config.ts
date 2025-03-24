// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/eslint',
  ],
  devtools: { enabled: false },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/policy': { prerender: true },
  },
  compatibilityDate: '2024-11-01',
  eslint: {
    config: {
      standalone: false,
      stylistic: true,
    },
  },
})
