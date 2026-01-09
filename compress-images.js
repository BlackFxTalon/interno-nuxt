/**
 * Скрипт для быстрого сжатия существующих PNG/JPG изображений
 * Сохраняет оригинальные форматы, но уменьшает размер
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'

// Конфигурация
const CONFIG = {
  sourceDir: './public/images',
  quality: [0.6, 0.8], // Диапазон качества для PNG
  jpegQuality: 80, // Качество для JPEG
}

const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.PNG', '.JPEG', '.JPG']

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

async function compressImage(filePath) {
  try {
    const buffer = await readFile(filePath)
    const originalSize = buffer.length

    if (originalSize < 100 * 1024) {
      console.log(`⏭️  Пропущен (маленький): ${basename(filePath)}`)
      return null
    }

    const ext = extname(filePath).toLowerCase()
    let compressedBuffer

    if (ext === '.png') {
      compressedBuffer = await imagemin.buffer(buffer, {
        plugins: [
          imageminPngquant({ quality: CONFIG.quality }),
        ],
      })
    }
    else if (ext === '.jpg' || ext === '.jpeg') {
      compressedBuffer = await imagemin.buffer(buffer, {
        plugins: [
          imageminMozjpeg({ quality: CONFIG.jpegQuality }),
        ],
      })
    }

    if (compressedBuffer && compressedBuffer.length < originalSize) {
      await writeFile(filePath, compressedBuffer)
      const savings = ((1 - compressedBuffer.length / originalSize) * 100).toFixed(1)
      console.log(`✅ ${basename(filePath)}: ${(originalSize / 1024).toFixed(1)} KB → ${(compressedBuffer.length / 1024).toFixed(1)} KB (${savings}% savings)`)
      return { original: originalSize, compressed: compressedBuffer.length, savings }
    }
    else {
      console.log(`ℹ️  ${basename(filePath)}: без изменений`)
      return null
    }
  }
  catch (error) {
    console.error(`❌ Ошибка: ${basename(filePath)} - ${error.message}`)
    return null
  }
}

async function main() {
  console.log('🗜️  Начинаем сжатие изображений...\n')

  try {
    const images = await findImages(CONFIG.sourceDir)

    if (images.length === 0) {
      console.log('⚠️  Изображения не найдены')
      return
    }

    console.log(`📁 Найдено ${images.length} изображений\n`)

    let totalOriginal = 0
    let totalCompressed = 0
    let compressedCount = 0

    for (const image of images) {
      const result = await compressImage(image)
      if (result) {
        totalOriginal += result.original
        totalCompressed += result.compressed
        compressedCount++
      }
    }

    if (compressedCount > 0) {
      const totalSavings = ((1 - totalCompressed / totalOriginal) * 100).toFixed(1)
      console.log('\n📊 Итоги:')
      console.log(`Сжато файлов: ${compressedCount}`)
      console.log(`До: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`)
      console.log(`После: ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`)
      console.log(`Экономия: ${totalSavings}%`)
    }
    else {
      console.log('\nℹ️  Изображения не требуют сжатия')
    }
  }
  catch (error) {
    console.error('❌ Ошибка:', error.message)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main }
