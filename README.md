# Интерно Nuxt

Nuxt-сайт каталога товаров ООО "Интерно": матрасы, топперы, подушки, кровати и детские кровати. Контент хранится в репозитории через Nuxt Content. Редактор контента — Decap CMS в `/admin/`; сайт публикуется как SSG.

## Что есть в проекте

- Главная страница с hero-блоком, подборщиком матраса и секциями каталога.
- Каталог из Nuxt Content: 42 товара в 5 категориях.
- Страницы товаров `/product/[id]` с размерами, ценами, весом, цветами, галереей и формой заказа.
- Статические страницы из Markdown: "О нас", FAQ, возвраты и политика конфиденциальности.
- Decap CMS с русским интерфейсом для редактирования контента через Git.
- PWA-манифест, service worker, PWA-иконки и cookie-control.
- Yandex SmartCaptcha в формах заявок и заказов.

## Стек

- Nuxt 4, Vue 3, TypeScript
- Nuxt Content
- Decap CMS
- Tailwind CSS 4 через официальный Vite plugin
- Nuxt Image
- Vite PWA / Workbox
- VueUse, Floating Vue, Splide, Maska, @lucide/vue
- ESLint flat config на базе `@antfu/eslint-config`
- Vitest

`@vite-pwa/assets-generator` зафиксирован на `1.0.0`: `@vite-pwa/nuxt@1.1.1` требует peer dependency `^1.0.0` и пока не поддерживает генератор 2.x.
Его зависимость `sharp` через `overrides` использует ту же версию, что и Nuxt Image: загрузка разных версий libvips в одном процессе на Windows вызывает `ERR_DLOPEN_FAILED`.

Tailwind CSS 4 подключён через `@tailwindcss/vite` в `nuxt.config.ts`, без `@nuxtjs/tailwindcss` и Tailwind PostCSS-плагина.
Тема (`primary`, Inter), пути сканирования и совместимые базовые стили находятся в `assets/css/tailwind.css`.
Для `@apply` в Vue-компонентах добавляйте относительный `@reference` на этот файл; стили пишутся на CSS, не SCSS.
Минимальные поддерживаемые браузеры: Safari 16.4+, Chrome 111+, Firefox 128+.

Устаревший `lucide-vue-next` заменён на рекомендованный пакет `@lucide/vue`.

`better-sqlite3` обновлён до `^12.11.1`: чистая установка 13.0.3 на Windows запускает `node-gyp rebuild` и требует C++ toolchain с Windows SDK. Nuxt Content 3.16 поддерживает обе ветки.

Для peer dependencies Nuxt 4.6 явно добавлены build-зависимости `oxc-parser`, `unplugin` и `esbuild`.

## Требования

В `package.json` указано:

- Node.js `^22.22.3 || ^24.15.0 || >=26.0.0` (требование Nuxt 4.6)
- npm `>=10.0.0`

Файлы `.nvmrc` и `.node-version`, GitHub Actions и Netlify настроены на Node `22.22.3`. Для локальной разработки используйте эту версию:

```bash
nvm use
```

## Переменные окружения

Для SmartCaptcha нужен публичный ключ:

```bash
NUXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY=your-client-key
```

Decap CMS настраивается в `public/admin/config.yml`, а не через Nuxt runtime config.
Репозиторий по умолчанию — `BlackFxTalon/interno-nuxt`, ветка — `main`.
Для входа на опубликованном сайте нужен отдельный Decap-совместимый OAuth-сервис.
**Перед production-входом замените пример `backend.base_url` на реальный адрес сервиса.**
GitHub OAuth client secret хранится только на этом сервисе, никогда в `public/`.
Пошаговая настройка: [docs/content-editing.md](docs/content-editing.md).

## Установка

```bash
npm ci --include=optional
```

После смены версии Node.js остановите dev-сервер и повторите `npm ci --include=optional`.
Нельзя переиспользовать `node_modules` с нативными модулями от другой версии Node:
ABI `127` соответствует Node 22, `137` — Node 24.
Если ошибка касается только `better-sqlite3`, можно выполнить `npm rebuild better-sqlite3`.
При ошибке загрузки `sharp` используйте чистую установку по обновлённому lock-файлу,
чтобы удалить старую вложенную версию из генератора PWA.

## Разработка

```bash
npm run dev
```

По умолчанию Nuxt запускается на `http://localhost:3000`.
Для локального редактирования запустите `npm run cms:dev` во втором терминале
и откройте `http://localhost:3000/admin/`. GitHub OAuth локально не нужен.
Локальный proxy пишет файлы без автоматического commit/push и доступен только на loopback.

## Основные команды

```bash
npm run dev                 # dev-сервер
npm run cms:dev             # локальный Decap proxy (отдельный терминал)
npm run build               # сборка сервера (для SSG-деплоя не нужна)
npm run generate            # статическая генерация сайта и /admin/
npm run preview             # preview production-сборки
npm run lint                # ESLint
npm run lint:fix            # автоисправление ESLint
npm run test:unit           # Vitest
npm run typecheck           # проверка TypeScript и Vue через Nuxt
npm run generate-pwa-assets # генерация PWA assets из logo.svg
```

## Структура

```text
content/pages/        Markdown-страницы для Nuxt Content и Decap CMS
content/products/     JSON-документы товаров для Nuxt Content и Decap CMS
pages/                Nuxt routes
components/           Vue-компоненты интерфейса
components/content/   Renderer-обертки для Nuxt Content
components/ui/        Базовые UI-компоненты
components/header/    Компоненты шапки
composables/          Логика форм, loader и success modal
data/                 Данные подборщика матраса
server/api/           Nitro API routes
server/services/      Серверные helpers для каталога
public/               Иконки, favicon, robots.txt и публичные ассеты
public/admin/         Статическая админка Decap CMS, config и виджет цен/веса
scripts/cms-dev.mjs   Локальный proxy для редактирования без OAuth
assets/css/tailwind.css  Tailwind 4, тема и базовые стили
nuxt.config.ts        Nuxt, PWA, prerender и runtime config
netlify.toml          Настройки SSG deploy для Netlify
```

## Контент

Decap CMS — единственный редактор каталога, страниц, навигации и hero-блока.
Источник данных сайта — файлы в `content/`; автоматического импорта из внешних источников нет.
Инструкция для редактора и настройка публикации: [docs/content-editing.md](docs/content-editing.md).

Товары хранятся как отдельные JSON-файлы:

```text
content/products/matrasses/*.json
content/products/beds/*.json
content/products/childrenBeds/*.json
content/products/pillows/*.json
content/products/toppers/*.json
```

Каждый товар должен иметь минимум:

```json
{
  "slug": "Laticce",
  "category": "matrasses",
  "name": "Laticce",
  "images": [],
  "prices": {}
}
```

`slug` используется как публичный id в `/product/{slug}`. `category` должен быть одним из:

```text
matrasses
beds
childrenBeds
pillows
toppers
```

Страницы сайта хранятся в `content/pages/*.md` и рендерятся через `ContentRenderer`.
Навигация хранится в `content/navigation/header.json`, hero-блок — в `content/sections/hero.json`.

## Decap CMS

Админка — самостоятельная статическая страница `public/admin/index.html`.
Nuxt SSR и отдельная база данных для неё не нужны. Decap CMS загружается с CDN
с зафиксированной версией `3.16.3`; формы и интерфейс настроены на русский язык.

- Адрес: `/admin/`.
- Коллекции: пять категорий товаров, четыре Markdown-страницы, меню и hero-блок.
- Фото загружаются в `public/images/uploads` и публикуются как `/images/uploads/...`.
- Цены и вес редактируются строками «размер → значение», JSON-структура сохраняется.
- Для production нужен GitHub OAuth-сервис и право редактора на push в репозиторий.
- PWA не прекэширует админку и не подменяет её fallback-страницей сайта.

Настройка авторизации и инструкция редактору: [docs/content-editing.md](docs/content-editing.md).

## Деплой

```bash
npm run generate
```

`.github/workflows/deploy.yml` публикует `.output/public` на Timeweb через SSH;
`netlify.toml` также настроен на SSG. Каталог `/admin/` копируется вместе с сайтом.
Decap сохраняет контент в GitHub, push в `main` запускает существующий workflow.
Изменения становятся видны после успешной пересборки и деплоя, не мгновенно.

OAuth-сервис разворачивается отдельно — на Timeweb или другом хостинге.
Для сайта Node.js-сервер не требуется. На Timeweb настройте Nginx так, чтобы
`/admin/` раздавал `admin/index.html`, а `/admin/*` не кэшировался надолго
(пример конфигурации в инструкции).

## Проверки перед изменениями

Минимальный набор:

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run generate
```

Workflow деплоя проверяет типы и запускает unit-тесты перед генерацией сайта.
При ошибке проверок сборка и публикация не выполняются.

После изменения контента стоит открыть несколько карточек товаров и проверить, что `/api/products` возвращает все категории.
