import { queryCollection } from '@nuxt/content/server'
import { getProductCatalogFromContent } from '../services/products'

export default defineEventHandler(async (event) => {
  try {
    const products = await queryCollection(event, 'products').all()

    return getProductCatalogFromContent(products)
  }
  catch (error) {
    console.error('Error loading product data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load product data',
    })
  }
})
