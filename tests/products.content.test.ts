import { describe, expect, it } from 'vitest'
import {
  getProductRoutesFromCatalog,
  groupProductsByCategory,
  productCategoryKeys,
} from '../server/services/products'

describe('content product catalog helpers', () => {
  it('keeps all known categories even when some are empty', () => {
    const catalog = groupProductsByCategory([
      { id: 'bed-a', category: 'beds', name: 'Bed A', images: [], prices: {} },
      { id: 'pillow-a', category: 'pillows', name: 'Pillow A', images: [], prices: {} },
      { id: 'ignored', category: 'unknown', name: 'Ignored', images: [], prices: {} },
    ])

    expect(Object.keys(catalog)).toEqual(productCategoryKeys)
    expect(catalog.beds.map(product => product.id)).toEqual(['bed-a'])
    expect(catalog.pillows.map(product => product.id)).toEqual(['pillow-a'])
    expect(catalog.matrasses).toEqual([])
    expect(Object.values(catalog).flat()).toHaveLength(2)
  })

  it('builds product routes from grouped content products', () => {
    const routes = getProductRoutesFromCatalog({
      matrasses: [
        { id: 'Laticce', category: 'matrasses', name: 'Laticce', images: [], prices: {} },
      ],
      beds: [],
      childrenBeds: [],
      pillows: [
        { id: 'Ergo', category: 'pillows', name: 'Ergo', images: [], prices: {} },
      ],
      toppers: [],
    })

    expect(routes).toEqual(['/product/Laticce', '/product/Ergo'])
  })
})
