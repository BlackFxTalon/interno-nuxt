# Интерно Nuxt

Статический Nuxt-сайт для каталога товаров ООО "Интерно": матрасы, топперы, подушки, кровати и детские кровати. Проект собирается в статическую выдачу, пререндерит карточки товаров из JSON-данных и содержит PWA-настройки для установки сайта как приложения.

## Что есть в проекте

- Главная страница с hero-блоком, подборщиком матраса и секциями каталога.
- Каталог из локальных JSON-файлов: 42 товара в 5 категориях.
- Страницы товаров `/product/[id]` с размерами, ценами, весом, цветами, галереей и формой заказа.
- Статические страницы: "О нас", FAQ, возвраты и политика конфиденциальности.
- PWA-манифест, service worker, генерация PWA-иконок и cookie-control.
- Yandex SmartCaptcha в формах заявок и заказов.
- Статический деплой через `npm run generate` в `.output/public`.

## Стек

- Nuxt 4, Vue 3, TypeScript
- Tailwind CSS
- Nuxt Image
- Vite PWA / Workbox
- VueUse, Floating Vue, Splide, Maska, lucide-vue-next
- ESLint flat config на базе `@antfu/eslint-config`
- Husky, lint-staged, commitlint

## Требования

В `package.json` указано:

- Node.js `>=20.19.0`
- npm `>=10.0.0`

Файлы `.nvmrc` и `.node-version` сейчас указывают Node `22`, поэтому для локальной разработки безопаснее использовать Node 22:

```bash
nvm use
```

Если `nvm` не установлен, поставьте Node.js 20.19.0 или новее.

## Переменные окружения

Для SmartCaptcha нужен публичный ключ:

```bash
NUXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY=your-client-key
```

Формы в `useFormSubmit` отправляют данные на `/api/send-email`. В текущем репозитории есть только `server/api/products.get.ts`, route `server/api/send-email.*` отсутствует. Для рабочей отправки заявок нужно добавить Nitro route, serverless function или внешний proxy на стороне деплоя.

Для GitHub Actions деплоя в Timeweb используются secrets:

- `NUXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY`
- `SSH_HOST`
- `SSH_USERNAME`
- `SSH_PRIVATE_KEY`
- `DEPLOY_PATH`

## Установка

```bash
npm ci
```

## Разработка

```bash
npm run dev
```

По умолчанию Nuxt запускается на `http://localhost:3000`.

## Основные команды

```bash
npm run dev                 # dev-сервер
npm run build               # production build
npm run generate            # статическая генерация в .output/public
npm run preview             # локальный preview production-сборки
npm run lint                # проверка ESLint
npm run lint:fix            # автоисправление ESLint
npm run generate-pwa-assets # генерация PWA assets из logo.svg
```

## Структура

```text
pages/                 Маршруты Nuxt
components/            Vue-компоненты интерфейса
components/ui/         Базовые UI-компоненты
components/header/     Компоненты шапки
composables/           Переиспользуемая логика форм, loader и success modal
data/                  JSON-данные каталога и подборщика матраса
server/api/            Nitro API routes
public/                Иконки, favicon, robots.txt и публичные ассеты
nuxt.config.ts         Nuxt, PWA, prerender и runtime config
netlify.toml           Настройки статического деплоя Netlify
.github/workflows/     CI/CD деплой в Timeweb Cloud
```

## Данные каталога

Товары хранятся в `data/*.json`:

- `matrasses.json` - 15 матрасов
- `beds.json` - 9 кроватей
- `childrenBeds.json` - 8 детских кроватей
- `pillows.json` - 5 подушек
- `toppers.json` - 5 топперов

`nuxt.config.ts` читает эти файлы во время сборки и добавляет все `/product/{id}` в `nitro.prerender.routes`.

## Деплой

Статическая сборка:

```bash
npm run generate
```

Результат публикуется из:

```text
.output/public
```

В репозитории есть два сценария деплоя:

- `netlify.toml` - сборка `npm run generate`, publish directory `.output/public`, SPA fallback и cache headers.
- `.github/workflows/deploy.yml` - GitHub Actions деплой в Timeweb Cloud через SCP, затем проверка и reload Nginx.

На хостинге укажите Node.js 22 или минимум 20.19.0.

## Проверки перед изменениями

Минимальный набор:

```bash
npm run lint
npm run generate
```

Если менялись только данные каталога, дополнительно проверьте валидность JSON и откройте несколько карточек товаров после генерации.
