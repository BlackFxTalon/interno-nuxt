export default defineEventHandler(async () => {
  try {
    // Import all product data
    const matrasses = await import('~/data/matrasses.json')
    const beds = await import('~/data/beds.json')
    const pillows = await import('~/data/pillows.json')
    const toppers = await import('~/data/toppers.json')

    return {
      matrasses: matrasses.default.matrasses || [],
      beds: beds.default.beds || [],
      pillows: pillows.default.pillows || [],
      toppers: toppers.default.toppers || [],
    }
  }
  catch (error) {
    console.error('Error loading product data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load product data',
    })
  }
})
