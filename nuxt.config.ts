/// <reference types="node" />
// https://nuxt.com/docs/api/configuration/nuxt-config
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

const contentProductsDir = fileURLToPath(new URL('./content/products', import.meta.url))

function collectJsonFiles(dir: string): string[] {
  if (!existsSync(dir))
    return []

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)

    if (entry.isDirectory())
      return collectJsonFiles(path)

    return entry.isFile() && entry.name.endsWith('.json') ? [path] : []
  })
}

function getContentProductRoutes(): string[] {
  return collectJsonFiles(contentProductsDir).flatMap((file) => {
    try {
      const product = JSON.parse(readFileSync(file, 'utf8')) as { slug?: unknown }

      return typeof product.slug === 'string'
        ? [`/product/${encodeURIComponent(product.slug)}`]
        : []
    }
    catch (error) {
      console.warn(`[Prerender] Failed to read product content file ${file}`, error)
      return []
    }
  })
}

const productRoutes = getContentProductRoutes()

console.log(`[Prerender] Will generate ${productRoutes.length} content product pages`)

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    'floating-vue/nuxt',
    '@vite-pwa/nuxt',
    '@dargmuesli/nuxt-cookie-control',
  ],
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
  css: ['~/assets/css/tailwind.css'],
  runtimeConfig: {
    public: {
      smartcaptchaClientKey: process.env.NUXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY || '',
    },
  },
  compatibilityDate: '2025-08-11',
  nitro: {
    // Nuxt 4.6 resolves runtime imports to file URLs; keep them bundled on Windows too.
    externals: {
      inline: [/[/\\]nuxt[/\\]dist[/\\]/, /[/\\]@nuxt[/\\]nitro-server[/\\]dist[/\\]/],
    },
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: productRoutes,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@splidejs/splide',
        'maska/vue',
        'workbox-window',
        '@lucide/vue',
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
      globIgnores: ['**/_payload.json', 'admin/**'],
      navigateFallbackDenylist: [/^\/admin(?:\/|$)/],
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
      enabled: false,
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
