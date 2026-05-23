/// <reference types="node" />
// https://nuxt.com/docs/api/configuration/nuxt-config
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

interface ProductRouteSource {
  id: string
}

function readProductRoutes(fileName: string, key: string) {
  const dataDir = resolve(dirname(fileURLToPath(import.meta.url)), 'data')
  const data = JSON.parse(readFileSync(resolve(dataDir, fileName), 'utf-8')) as Record<string, ProductRouteSource[] | undefined>

  return (data[key] || []).map(product => `/product/${product.id}`)
}

const productRoutes = [
  ...readProductRoutes('matrasses.json', 'matrasses'),
  ...readProductRoutes('beds.json', 'beds'),
  ...readProductRoutes('childrenBeds.json', 'childrenBeds'),
  ...readProductRoutes('pillows.json', 'pillows'),
  ...readProductRoutes('toppers.json', 'toppers'),
]

console.log(`[Prerender] Will generate ${productRoutes.length} product pages`)

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
      script: [
        {
          src: 'https://smartcaptcha.cloud.yandex.ru/captcha.js',
          defer: true,
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      // eslint-disable-next-line node/prefer-global/process
      smartcaptchaClientKey: process.env.NUXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY || '',
    },
  },
  compatibilityDate: '2025-08-11',
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: productRoutes,
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        '@splidejs/splide',
        'maska/vue',
        'workbox-window',
        'lucide-vue-next'
      ],
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
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,json,webp}'],
      globIgnores: ['**/_payload.json'],
      maximumFileSizeToCacheInBytes: 10485760, // 10 MB limit to cache large images
      runtimeCaching: [
        {
          urlPattern: /^\/images\/(?!optimized\/)/,
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
          urlPattern: /^\/images\/optimized\//,
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
          urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\//,
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
          urlPattern: /^\/api\//,
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
