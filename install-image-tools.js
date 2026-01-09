/**
 * Скрипт для установки пакетов для оптимизации изображений
 */

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

console.log('📦 Установка пакетов для оптимизации изображений...\n')

// Пакеты для оптимизации
const packages = [
  'sharp', // Основной движок для оптимизации
  'imagemin', // Для дополнительной оптимизации
  'imagemin-pngquant', // PNG оптимизация
  'imagemin-mozjpeg', // JPEG оптимизация
  'imagemin-webp', // WebP конвертация
]

try {
  // Устанавливаем пакеты
  console.log('Установка npm пакетов...')
  execSync(`npm install -D ${packages.join(' ')}`, { stdio: 'inherit' })

  // Обновляем package.json с новыми скриптами
  const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))

  // Добавляем новые скрипты
  packageJson.scripts = packageJson.scripts || {}
  packageJson.scripts['images:optimize'] = 'node optimize-images.js'
  packageJson.scripts['images:compress'] = 'node compress-images.js'

  writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))

  console.log('\n✅ Все пакеты установлены успешно!')
  console.log('\n📋 Доступные команды:')
  console.log('   npm run images:optimize  - Оптимизировать и конвертировать изображения')
  console.log('   npm run images:compress  - Сжать существующие изображения')
}
catch (error) {
  console.error('❌ Ошибка при установке пакетов:', error.message)
}
