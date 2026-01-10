// https://nuxt.com/docs/api/configuration/nuxt-config
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    'floating-vue/nuxt',
    '@vite-pwa/nuxt',
    '@dargmuesli/nuxt-cookie-control',
  ],
  ssr: false,
  devtools: { enabled: false },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
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
  runtimeConfig: {
    public: {
      // Web3Forms Access Key - подхватывается из переменной окружения NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY
      // eslint-disable-next-line node/prefer-global/process
      web3formsAccessKeyOne: process.env.NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY_ONE || '',
      // eslint-disable-next-line node/prefer-global/process
      web3formsAccessKeyTwo: process.env.NUXT_PUBLIC_WEB3FORMS_ACCESS_KEY_TWO || '',
    },
  },
  compatibilityDate: '2025-08-11',
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      failOnError: true,
    },
  },
  // Хук для генерации всех product страниц и оптимизации изображений
  hooks: {
    'nitro:config': async function (nitroConfig) {
      if (nitroConfig.prerender) {
        // Получаем все ID продуктов из ваших JSON файлов
        const dataDir = resolve(__dirname, 'data')

        const matrasses = JSON.parse(readFileSync(resolve(dataDir, 'matrasses.json'), 'utf-8')).matrasses || []
        const beds = JSON.parse(readFileSync(resolve(dataDir, 'beds.json'), 'utf-8')).beds || []
        const pillows = JSON.parse(readFileSync(resolve(dataDir, 'pillows.json'), 'utf-8')).pillows || []
        const toppers = JSON.parse(readFileSync(resolve(dataDir, 'toppers.json'), 'utf-8')).toppers || []

        // Формируем список маршрутов
        const productRoutes = [
          ...matrasses.map((p: { id: string }) => `/product/${p.id}`),
          ...beds.map((p: { id: string }) => `/product/${p.id}`),
          ...pillows.map((p: { id: string }) => `/product/${p.id}`),
          ...toppers.map((p: { id: string }) => `/product/${p.id}`),
        ]

        // Добавляем маршруты в prerender
        if (!nitroConfig.prerender.routes) {
          nitroConfig.prerender.routes = []
        }
        nitroConfig.prerender.routes.push(...productRoutes)

        console.log(`[Prerender] Will generate ${productRoutes.length} product pages`)
      }
    },
    'build:before': async function () {
      console.log('🚀 Начинаем оптимизацию изображений перед сборкой...\n')

      // Импортируем и запускаем оптимизацию
      try {
        const { optimizeImages } = await import('./utils/image-optimizer.js')
        await optimizeImages()
        console.log('✅ Оптимизация изображений завершена\n')
      }
      catch (error: unknown) {
        console.warn('⚠️ Не удалось оптимизировать изображения:', (error as Error).message)
        // Не прерываем сборку из-за ошибки оптимизации
      }
    },
  },
  cookieControl: {
    barPosition: 'bottom-full',
    // The cookies that are to be controlled.
    // See detailed explanation further down below!
    cookies: {
      necessary: [],
      optional: [],
    },
    // The milliseconds from now until expiry of the cookies that are being set by this module.
    cookieExpiryOffsetMs: 1000 * 60 * 60 * 24 * 365, // one year
    // Switch to toggle the button that opens the configuration modal.
    isControlButtonEnabled: false,
    // The locales to include.
    locales: ['ru'],
  },
  eslint: {
    config: {
      standalone: false,
      stylistic: true,
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Интерно — товары для здорового сна',
      short_name: 'Интерно',
      description: 'Матрасы, подушки, кровати и аксессуары для здорового сна в Екатеринбурге.',
      theme_color: '#0580C7',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      lang: 'ru',
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,json,webp}'],
      maximumFileSizeToCacheInBytes: 10485760, // 10 MB limit to cache large images
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.origin === globalThis.location.origin && url.pathname.startsWith('/images/'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'interno-images',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: ({ url }) => url.origin === globalThis.location.origin && url.pathname.startsWith('/images/optimized/'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'interno-optimized-images',
            expiration: {
              maxEntries: 150,
              maxAgeSeconds: 60 * 60 * 24 * 90, // 90 дней для оптимизированных
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: ({ url }) => ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].includes(url.origin),
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            cacheableResponse: {
              statuses: [0, 200],
            },
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          },
        },
        {
          urlPattern: ({ url }) => url.origin === globalThis.location.origin && url.pathname.startsWith('/api/'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'interno-api',
            networkTimeoutSeconds: 10,
          },
        },
      ],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 60 * 60 * 12,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
    },
    pwaAssets: {
      disabled: false,
      image: 'logo.svg',
      preset: 'minimal-2023',
      includeHtmlHeadLinks: true,
      injectThemeColor: true,
      overrideManifestIcons: true,
    },
  },
})
