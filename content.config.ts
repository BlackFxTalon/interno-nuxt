import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { productCategoryKeys } from './types/catalog'

const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  alt: z.string(),
  label: z.string().optional(),
}).passthrough()

const productOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
}).passthrough()

const stringOrNumberSchema = z.union([z.string(), z.number()])

const navigationLinkSchema = z.object({
  text: z.string(),
  to: z.string(),
})

const heroImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
})

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: 'pages/**/*.md',
      schema: z.object({
        slug: z.string(),
        title: z.string(),
        description: z.string().optional(),
      }),
    }),
    products: defineCollection({
      type: 'data',
      source: 'products/**/*.json',
      schema: z.object({
        slug: z.string(),
        category: z.enum(productCategoryKeys),
        name: z.string(),
        description: z.string().optional(),
        advantages: z.array(z.string()).optional(),
        antivandalVelor: z.array(z.string()).optional(),
        colors: z.array(productOptionSchema).optional(),
        images: z.array(productImageSchema).default([]),
        liftingMechanism: z.array(z.string()).optional(),
        materials: z.array(z.string()).optional(),
        prices: z.record(z.string(), stringOrNumberSchema).default({}),
        robotVacuumCleanerLegs: z.array(z.string()).optional(),
        sizes: z.array(productOptionSchema).optional(),
        weights: z.record(z.string(), stringOrNumberSchema).optional(),
      }).passthrough(),
    }),
    navigation: defineCollection({
      type: 'data',
      source: 'navigation/**/*.json',
      schema: z.object({
        links: z.array(navigationLinkSchema).default([]),
      }),
    }),
    sections: defineCollection({
      type: 'data',
      source: 'sections/**/*.json',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        buttonText: z.string(),
        images: z.array(heroImageSchema).default([]),
      }),
    }),
  },
})
