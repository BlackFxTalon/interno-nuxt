// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  app: {
    head: {
      title: 'Mattress & Wardrobe Store',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        },
         {
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap'
        }
      ]  
    }
  },
  // Enable static site generation
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/mattresses',
        '/wardrobes',
        '/beds',
        '/accessories'
      ]
    }
  }
})
