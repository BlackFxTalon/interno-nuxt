/**
 * Скрипт для пакетной оптимизации изображений
 * Оптимизирует PNG/JPG изображения и конвертирует их в WebP
 */

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join } from 'node:path'
import sharp from 'sharp'

// Конфигурация
const CONFIG = {
  sourceDir: './public/images',
  outputDir: './public/images/optimized',
  quality: 80,
  formats: ['webp', 'avif'], // WebP и AVIF для лучшей оптимизации
  maxOriginalSize: 7 * 1024 * 1024, // 7MB - порог для оптимизации
}

// Поддерживаемые форматы для оптимизации
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.PNG', '.JPEG', '.JPG']

/**
 * Найти все изображения в директории рекурсивно
 */
async function findImages(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      await findImages(fullPath, files)
    }
    else if (SUPPORTED_EXTENSIONS.includes(extname(entry.name))) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Оптимизировать одно изображение
 */
async function optimizeImage(inputPath, outputDir) {
  try {
    const stats = await readFile(inputPath)
    const size = stats.length

    // Пропускаем уже маленькие изображения
    if (size < 100 * 1024) {
      console.log(`⏭️  Пропущен (маленький): ${basename(inputPath)} (${(size / 1024).toFixed(1)} KB)`)
      return { skipped: true, reason: 'small' }
    }

    const relativePath = inputPath.replace(`${CONFIG.sourceDir}/`, '')
    const fileName = basename(relativePath, extname(relativePath))
    const subDir = dirname(relativePath)

    // Создаем директорию для выходных файлов
    const targetDir = join(outputDir, subDir)
    await mkdir(targetDir, { recursive: true })

    const results = []

    // Оптимизируем в каждом формате
    for (const format of CONFIG.formats) {
      const outputPath = join(targetDir, `${fileName}.${format}`)

      let image = sharp(inputPath)

      // Оптимизация для разных форматов
      if (format === 'webp') {
        await image.webp({ quality: CONFIG.quality }).toFile(outputPath)
      }
      else if (format === 'avif') {
        await image.avif({ quality: CONFIG.quality - 5 }).toFile(outputPath)
      }

      const optimizedStats = await readFile(outputPath)
      const optimizedSize = optimizedStats.length
      const savings = ((1 - optimizedSize / size) * 100).toFixed(1)

      results.push({
        format,
        path: outputPath.replace('./public/', '/'),
        size: optimizedSize,
        savings: savings > 0 ? savings : 0,
      })

      console.log(`✅ ${basename(inputPath)} → ${format.toUpperCase()}: ${(optimizedSize / 1024).toFixed(1)} KB (${savings}% savings)`)
    }

    // Если оригинал очень большой, создаем уменьшенную версию
    if (size > CONFIG.maxOriginalSize) {
      const webpPath = join(targetDir, `${fileName}.webp`)
      const smallPath = join(targetDir, `${fileName}-small.webp`)

      await sharp(webpPath)
        .resize(1920, null, { withoutEnlargement: true })
        .webp({ quality: CONFIG.quality - 10 })
        .toFile(smallPath)

      const smallStats = await readFile(smallPath)
      console.log(`🎯 ${basename(inputPath)} → small.webp: ${(smallStats.length / 1024).toFixed(1)} KB (оптимизировано для мобильных)`)
    }

    return { success: true, results }
  }
  catch (error) {
    console.error(`❌ Ошибка оптимизации ${inputPath}:`, error.message)
    return { error: error.message }
  }
}

/**
 * Главная функция
 */
async function main() {
  console.log('🚀 Начинаем оптимизацию изображений...\n')

  try {
    // Проверяем существование исходной директории
    const images = await findImages(CONFIG.sourceDir)

    if (images.length === 0) {
      console.log('⚠️  Изображения не найдены в', CONFIG.sourceDir)
      return
    }

    console.log(`📁 Найдено ${images.length} изображений для обработки\n`)

    // Создаем выходную директорию
    await mkdir(CONFIG.outputDir, { recursive: true })

    // Оптимизируем каждое изображение
    let totalOriginal = 0
    let totalOptimized = 0
    let processed = 0

    for (const imagePath of images) {
      const result = await optimizeImage(imagePath, CONFIG.outputDir)

      if (result.success && result.results) {
        processed++
        const originalSize = (await readFile(imagePath)).length
        totalOriginal += originalSize

        // Считаем только WebP как основной оптимизированный размер
        const webpResult = result.results.find(r => r.format === 'webp')
        if (webpResult) {
          totalOptimized += webpResult.size
        }
      }
    }

    // Статистика
    console.log('\n📊 Итоговая статистика:')
    console.log(`Обработано: ${processed} изображений`)
    console.log(`Оригинальный размер: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`)
    console.log(`После оптимизации: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Экономия: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`)

    console.log('\n✅ Оптимизация завершена!')
    console.log('\n💡 Следующие шаги:')
    console.log('1. Обновите компоненты для использования оптимизированных изображений:')
    console.log('   <NuxtImg src="/images/optimized/beds/asti/asti-025649-aside.webp" />')
    console.log('2. Обновите PWA конфиг для кэширования WebP/AVIF файлов')
    console.log('3. Удалите оригинальные большие файлы после тестирования')
  }
  catch (error) {
    console.error('❌ Критическая ошибка:', error)
  }
}

// Запуск
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main }
