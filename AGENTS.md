# Repository Guidelines

## Структура проекта и модули
- Nuxt 4 SPA с `ssr: false`, статическая генерация через Nitro, артефакт деплоя: `.output/public`.
- Страницы — в `pages/`, карточка товара: `pages/product/[id].vue`.
- UI-компоненты — в `components/`, лейауты — в `layouts/`, плагины — в `plugins/`.
- Данные каталога — в `data/*.json`, агрегатор — `server/api/products.get.ts`.
- Статика и PWA-ассеты — в `public/`, генерация иконок из `logo.svg`.
- Конфиг Netlify — `netlify.toml`, prerender маршрутов настраивается в `nuxt.config.ts`.

## Команды сборки, теста и разработки
- `npm install` — установка зависимостей (Node >= 20.19.0, npm >= 10).
- `npm run dev` — локальная разработка.
- `npm run build` — сборка приложения.
- `npm run generate` — статическая генерация в `.output/public`.
- `npm run preview` — локальный предпросмотр сборки.
- `npm run lint` / `npm run lint:fix` — проверка/автоисправление ESLint.
- `npm run generate-pwa-assets` — пересоздание PWA иконок из `logo.svg`.

## Стиль кода и именование
- ESLint: `@antfu/eslint-config` + Nuxt flat config, отступ — 2 пробела.
- Vue SFC по стандартам Nuxt; для изображений предпочтителен `NuxtImg`.
- Идентификаторы товаров в `data/*.json` должны совпадать с роутами и именами ассетов.
- Формат изображений кроватей:  
  `.../beds/<bedId>/<bedId>-<colorCode>-<view>.webp`,  
  где `<bedId>` — kebab-case, `<view>` — `aside|lifting|front`.

## Тестирование
- Тесты сейчас не настроены.
- При добавлении тестов: задокументируйте фреймворк, добавьте скрипт в `package.json`, размещайте файлы в `tests/` или `__tests__/`.

## Коммиты и Pull Request
- Сообщения коммитов короткие, повелительное наклонение; допустимы RU/EN (например, “Add SmartCaptcha configuration”).
- В PR укажите описание, ссылку на задачу (если есть), скриншоты для UI-правок.
- Отдельно отмечайте изменения в `data/*.json` и новые переменные окружения.

## Безопасность, конфиг и MCP/Codex
- Секреты не коммитить. Для SmartCaptcha используется `NUXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY`.
- Эндпоинт `/api/send-email` отсутствует — перед интеграцией форм добавьте/проверьте серверный хендлер.
- MCP для Codex настраивается в `.codex/config.toml` (проектно). Для локальных stdio-серверов задайте `FIRECRAWL_API_KEY` и `CONTEXT7_API_KEY` в окружении запускающего процесса.

## Примеры `.codex/config.toml`
```toml
[mcp_servers.firecrawl]
command = "npx"
args = ["-y", "firecrawl-mcp"]
env_vars = ["FIRECRAWL_API_KEY"]

[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
env_vars = ["CONTEXT7_API_KEY"]
```
