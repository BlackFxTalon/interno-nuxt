export const productCategoryKeys = [
  'matrasses',
  'beds',
  'childrenBeds',
  'pillows',
  'toppers',
] as const

export type ProductCategoryKey = typeof productCategoryKeys[number]

export interface ProductImage {
  id?: string
  url: string
  alt: string
  label?: string
}

export interface Product {
  id: string
  category: ProductCategoryKey | string
  name: string
  description?: string
  images: ProductImage[]
  prices: Record<string, number | string>
  [key: string]: unknown
}

export type ProductCatalog = Record<ProductCategoryKey, Product[]>
