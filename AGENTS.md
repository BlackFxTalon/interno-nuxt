# AGENTS.md — interno-nuxt

## Проект
- Nuxt 4 (SPA), `ssr: false`; статическая генерация через Nitro (`preset: "static"`).
- Деплой — статик (`npm run generate`), output: `.output/public`.
- Каталог товаров: данные в `data/*.json`, страницы `/product/:id` генерируются из этих данных.

## Быстрый старт
- Требуется Node `>=20.19.0` (см. `.nvmrc`, `.node-version`).
- Команды: `npm install`, `npm run dev`, `npm run generate`, `npm run build`, `npm run preview`, `npm run lint`.

## Структура и потоки данных
- `pages/` — основные страницы; карточка товара: `pages/product/[id].vue`.
- `server/api/products.get.ts` — агрегирует данные из `data/*.json`.
- `data/` — источники: `matrasses.json`, `beds.json`, `pillows.json`, `toppers.json`.
- `nuxt.config.ts` — hook `nitro:config` добавляет routes `/product/:id` для пререндеринга.
- Для кроватей изображения формируются по шаблону:
  `https://storage.yandexcloud.net/interno-images/optimized/public/images/beds/<bedId>/<bedId>-<colorCode>-<view>.webp`
  где `<bedId>` — kebab-case, `<view>`: `aside|lifting|front`, `<colorCode>` = hex без `#`.

## Формы и капча
- Модалки: `components/InquiryFormModal.vue`, `components/OrderModal.vue`.
- Отправка в `/api/send-email` — эндпоинт в репо отсутствует; перед доработками проверь/добавь серверный хендлер.
- SmartCaptcha: скрипт подключён в `nuxt.config.ts`, ключ берётся из `NUXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY` (значение не коммитить).

## Изображения и PWA
- `@nuxt/image` используется для оптимизации; предпочтительно `NuxtImg` + `public/images`.
- PWA/Workbox настроен в `nuxt.config.ts`, ассеты генерируются из `logo.svg`.

## Деплой
- Netlify: `netlify.toml` запускает `npm run generate`, публикует `.output/public`, есть SPA redirect на `/index.html`.

## Известные несоответствия
- В документации есть ссылки на `utils/image-optimizer.js`, но файла нет — не полагайся на него без проверки.
