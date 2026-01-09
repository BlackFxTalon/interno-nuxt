/**
 * Утилита для автоматической оптимизации изображений при сборке
 * Оптимизирует только если нет оптимизированной версии или оригинал изменился
 */

import { mkdir, readdir, readFile, stat } from 'node:fs/promises'
import { basename, dirname, extname, join } from 'node:path'
import { argv } from 'node:process'
import sharp from 'sharp'

// Конфигурация
const CONFIG = {
  sourceDir: './public/images',
  outputDir: './public/images/optimized',
  quality: 80,
  maxOriginalSize: 7 * 1024 * 1024, // 7MB
  minSizeForOptimization: 100 * 1024, // 100KB
}

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
 * Проверить, нужно ли оптимизировать изображение
 */
async function needsOptimization(inputPath, outputDir) {
  try {
    const relativePath = inputPath.replace(`${CONFIG.sourceDir}/`, '')
    const fileName = basename(relativePath, extname(relativePath))
    const subDir = dirname(relativePath)
    const targetDir = join(outputDir, subDir)

    // Проверяем существование оптимизированной версии
    const webpPath = join(targetDir, `${fileName}.webp`)

    const [inputStats, webpExists] = await Promise.all([
      stat(inputPath),
      stat(webpPath).catch(() => null),
    ])

    // Если нет оптимизированной версии - нужно оптимизировать
    if (!webpExists)
      return true

    // Если оригинал новее чем оптимизированный - нужно обновить
    if (inputStats.mtime > webpExists.mtime) {
      return true
    }

    return false
  }
  catch {
    return true // Если что-то пошло не так - оптимизируем
  }
}

/**
 * Оптимизировать одно изображение
 */
async function optimizeSingleImage(inputPath, outputDir) {
  try {
    const stats = await readFile(inputPath)
    const size = stats.length

    // Пропускаем слишком маленькие изображения
    if (size < CONFIG.minSizeForOptimization) {
      return { skipped: true, reason: 'small' }
    }

    const relativePath = inputPath.replace(`${CONFIG.sourceDir}/`, '')
    const fileName = basename(relativePath, extname(relativePath))
    const subDir = dirname(relativePath)

    // Создаем директорию для выходных файлов
    const targetDir = join(outputDir, subDir)
    await mkdir(targetDir, { recursive: true })

    const results = []

    // Оптимизируем в WebP
    const outputPath = join(targetDir, `${fileName}.webp`)
    const image = sharp(inputPath)
    await image.webp({ quality: CONFIG.quality }).toFile(outputPath)

    const optimizedStats = await readFile(outputPath)
    const optimizedSize = optimizedStats.length
    const savings = ((1 - optimizedSize / size) * 100).toFixed(1)

    results.push({
      format: 'webp',
      path: outputPath.replace('./public/', '/'),
      size: optimizedSize,
      savings: savings > 0 ? savings : 0,
    })

    return { success: true, results }
  }
  catch (error) {
    return { error: error.message }
  }
}

/**
 * Основная функция оптимизации
 */
export async function optimizeImages() {
  try {
    // Проверяем существование исходной директории
    const images = await findImages(CONFIG.sourceDir)

    if (images.length === 0) {
      // eslint-disable-next-line no-console
      console.log('⚠️  Изображения не найдены в', CONFIG.sourceDir)
      return
    }

    // Фильтруем только те, которые нужно оптимизировать
    const imagesToOptimize = []
    for (const image of images) {
      if (await needsOptimization(image, CONFIG.outputDir)) {
        imagesToOptimize.push(image)
      }
    }

    if (imagesToOptimize.length === 0) {
      // eslint-disable-next-line no-console
      console.log('ℹ️  Все изображения уже оптимизированы')
      return
    }

    // eslint-disable-next-line no-console
    console.log(`📁 Найдено ${imagesToOptimize.length} изображений для оптимизации\n`)

    // Оптимизируем каждое изображение
    let totalOriginal = 0
    let totalOptimized = 0
    let processed = 0
    let skipped = 0

    for (const imagePath of imagesToOptimize) {
      const result = await optimizeSingleImage(imagePath, CONFIG.outputDir)

      if (result.skipped) {
        skipped++
        continue
      }

      if (result.success && result.results) {
        processed++
        const originalSize = (await readFile(imagePath)).length
        totalOriginal += originalSize

        // Считаем только WebP как основной оптимизированный размер
        const webpResult = result.results.find(r => r.format === 'webp')
        if (webpResult) {
          totalOptimized += webpResult.size
        }

        // Выводим прогресс каждые 10 файлов
        if (processed % 10 === 0) {
          // eslint-disable-next-line no-console
          console.log(`📊 Прогресс: ${processed}/${imagesToOptimize.length}`)
        }
      }
    }

    // Статистика
    if (processed > 0) {
      // eslint-disable-next-line no-console
      console.log('\n📊 Итоговая статистика:')
      // eslint-disable-next-line no-console
      console.log(`Оптимизировано: ${processed} изображений`)
      // eslint-disable-next-line no-console
      console.log(`Пропущено: ${skipped} изображений`)
      // eslint-disable-next-line no-console
      console.log(`Оригинальный размер: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`)
      // eslint-disable-next-line no-console
      console.log(`После оптимизации: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`)
      // eslint-disable-next-line no-console
      console.log(`Экономия: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`)
    }
    else if (skipped > 0) {
      // eslint-disable-next-line no-console
      console.log('ℹ️  Все изображения уже оптимизированы')
    }
  }
  catch (error) {
    console.error('❌ Ошибка оптимизации:', error.message)
    throw error
  }
}

// Для прямого запуска из командной строки
const isMainModule = import.meta.url.includes(argv[1])
if (isMainModule) {
  optimizeImages()
}
