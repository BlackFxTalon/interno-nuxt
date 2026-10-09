import type { Product, ProductCatalog, ProductCategoryKey } from '../../types/catalog'
import { productCategoryKeys } from '../../types/catalog'

export { productCategoryKeys }
export type { Product, ProductCatalog, ProductCategoryKey }

type ContentProduct = Record<string, unknown> & {
  slug?: unknown
  productId?: unknown
  category?: unknown
  name?: unknown
  images?: unknown
  prices?: unknown
}

function isProductCategory(category: string): category is ProductCategoryKey {
  return productCategoryKeys.includes(category as ProductCategoryKey)
}

function asRecord(value: unknown): Record<string, number | string> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return {}

  return value as Record<string, number>
}

export function normalizeContentProduct(item: ContentProduct): Product | null {
  const id = typeof item.slug === 'string'
    ? item.slug
    : typeof item.productId === 'string'
      ? item.productId
      : ''

  if (!id || typeof item.category !== 'string' || typeof item.name !== 'string')
    return null

  const {
    slug: _slug,
    productId: _productId,
    path: _path,
    stem: _stem,
    extension: _extension,
    meta: _meta,
    navigation: _navigation,
    body: _body,
    ...product
  } = item

  return {
    ...product,
    id,
    category: item.category,
    name: item.name,
    images: Array.isArray(item.images) ? item.images as Product['images'] : [],
    prices: asRecord(item.prices),
  }
}

export function groupProductsByCategory(products: Product[]): ProductCatalog {
  const catalog = productCategoryKeys.reduce((acc, category) => {
    acc[category] = []
    return acc
  }, {} as ProductCatalog)

  for (const product of products) {
    if (isProductCategory(product.category))
      catalog[product.category].push(product)
  }

  return catalog
}

export function getProductCatalogFromContent(items: ContentProduct[]): ProductCatalog {
  return groupProductsByCategory(
    items
      .map(normalizeContentProduct)
      .filter((product): product is Product => product !== null),
  )
}

export function getProductRoutesFromCatalog(catalog: ProductCatalog): string[] {
  return Object.values(catalog)
    .flat()
    .map(product => `/product/${encodeURIComponent(product.id)}`)
}
