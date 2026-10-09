# План анализа и рефакторинга interno-nuxt

Дата: 2026-02-19. Обзор кодовой базы: ~6.6k строк, Nuxt 4 + Nuxt Content + PWA.
Словарь: **модуль** (интерфейс + реализация), **интерфейс** (всё, что должен знать вызывающий),
**шов** (место, где можно изменить поведение, не редактируя это место), **глубина**
(много поведения за малым интерфейсом).

---

## 1. Что уже хорошо

- `server/services/products.ts` — образцовый глубокий модуль: маленький интерфейс
  (`normalizeContentProduct`, `groupProductsByCategory`, `getProductCatalogFromContent`,
  `getProductRoutesFromCatalog`), вся грязь разбора Content-данных спрятана внутри, покрыт тестами.
- `content.config.ts` — схемы данных товаров описаны один раз (Zod), контент редактируется через Decap CMS.
- `content/products/*.json` — один файл на товар: правильный шов для контента.
- CI, husky + commitlint + lint-staged, eslint (antfu) — базовая гигиена есть.

## 2. Находки

### P0 — сломанное (чинить в первую очередь)

#### 2.1 Эндпоинт `/api/send-email` не существует
Все три формы (`OrderModal`, `InquiryFormModal`, `FindYourPerfectMatrassModal`) через
`useFormSubmit.submitForm()` постят на `/api/send-email` (`composables/useFormSubmit.ts:140`).
В `server/api/` есть только `products.get.ts`. В истории git эндпоинт не появлялся ни разу.
**Каждая отправка любой формы падает** — главная конверсионная функция сайта не работает.

#### 2.2 Деплой и серверные формы
Выбран **SSG**: `.github/workflows/deploy.yml` и `netlify.toml` используют
`npm run generate`. Decap CMS публикуется как статическая админка `/admin/`,
а GitHub OAuth-сервис разворачивается отдельно (см. `content-editing.md`).

Даже если добавить `server/api/send-email.post.ts`, на статическом деплое он выполняться не будет.
Для заявок нужен внешний сервис/CRM либо отдельный серверный endpoint.

#### 2.3 Незакоммиченная миграция `data/*.json` → `content/products/`
В working tree висят удаления `data/{beds,childrenBeds,matrasses,pillows,toppers}.json`,
правки `nuxt.config.ts`, `README.md`, `netlify.toml`. Миграция завершена логически —
нужно закоммитить одним связным коммитом, чтобы рабочее дерево не мешало рефакторингу.

### P1 — швы, которые окупятся

#### 2.4 Страница товара — god-компонент (559 строк)
`pages/product/[id].vue` смешивает:
- **поиск товара**: расплющивание каталога (5 категорий вручную, `allProducts`), определение
  категории 5 if-ами — при том, что `server/services/products.ts` уже даёт нужный шов;
- **машину состояния цены**: `price` мутируется в `watch(liftingMechanism, ...)` через
  `price.value += 3000`. Производная цена, мутируемая вотчером — источник багов:
  смена размера при выбранном «Есть» сбрасывает надбавку (смена размера пишет базовую цену),
  а повторное открытие страницы начинает не с базы. Надбавка +3000₽ — магическая константа;
- **генерацию URL картинок**: `generateColorImages()` хардкодит домен
  `https://ya.internomebel.ru/...` и конвертацию camelCase → kebab-case;
- просмотр «Характеристики/Преимущества», модалку заказа, alt-тексты видов.

План углубления:
- сервер отдаёт товар по id: `server/api/products/[id].get.ts` → `getProductById()`
  (новая функция в `services/products.ts`, там же её тест). Клиент перестаёт качать весь
  каталог на каждую страницу товара;
- модуль `composables/useProductPage.ts`: интерфейс = `{ product, price, weight, currentSize,
  currentColor, options, orderPayload }`; цена — **вычисляемое**, а не мутируемое состояние:
  `price = basePrice(sizes, currentSize) + surcharges(currentOptions)`, где надбавки приходят
  из данных товара (например, `liftingMechanismSurcharge: 3000` в JSON), а не из кода;
- генератор URL картинок кроватей — либо в данные (`content/products/beds/*.json` хранит
  готовые URL всех видов), либо в `services/products.ts` как чистая функция с тестом.

#### 2.5 `ProductsListSection` — логика фильтров в компоненте + строковая типизация
- `props.title === 'Матрасы' || props.title === 'Топперы'` — управление поведением по
  русскому отображаемому заголовку. Правильно: проп `category: ProductCategoryKey` (или
  `features: { firmness?: boolean, search?: boolean }`), заголовок остаётся презентацией.
- `itemsData: [Object, Set, Array, Map]` и 4 повторения `Array.isArray(...) ? ... :
  Object.values(...)` — интерфейс должен принимать просто `Product[]`.
- Фильтр по жёсткости, поиск по имени, сортировка по минимальной цене, пагинация — чистая
  логика, закопанная в компонент и обвешанная фальшивыми `withLoader(..., 1000)` (искусственная
  секунда задержки на каждый клик по фильтру). Вынести в модуль `composables/useProductFilters.ts`
  (или `utils/productFilters.ts`): чистые функции `filterByFirmness`, `searchByName`,
  `sortByMinPrice`, `paginate` + тесты. Бонус: `Math.min(...Object.values(prices))` сейчас
  работает на `string | number` — типизация вскроет это.

#### 2.6 Шов URL картинок
373 вхождения абсолютных URL `https://ya.internomebel.ru/...` в контент-JSON и код.
Смена домена/CDN = массовая правка данных. Предложение: хранить в JSON относительные пути,
а префикс добавлять в одном месте — `normalizeContentProduct` (сервер, уже нормализует товар)
или тонкий `useImageUrl()` на клиенте. Шов реальный: два адаптера (локальные картинки / CDN).

#### 2.7 `useFormSubmit` — мелкий модуль с широким интерфейсом
Возвращает 10 сущностей и смешивает: жизненный цикл виджета капчи (поиск DOM-элемента через
`document.getElementById(captchaContainerId)` — вывернутая связность), блокировку скролла body,
показ success-modal (setTimeout 100мс), HTTP-запрос и маппинг ошибок. Плюс `OrderModal` и
`InquiryFormModal` используют одинаковый id `captcha-container` — при одновременном монтировании
дубли DOM-id. Углубление:
- `useSmartCaptcha(containerRef)` — отдельный модуль капчи (рендер/уничтожение/токен);
- `useFormSubmit({ submit })` принимает **функцию отправки** (принимать зависимости, а не
  создавать) — тестируемость без сети, и переиспользование для любого бэкенда (см. P0);
- блокировку скролла — в общий `useModal()`/`v-modal-scroll-lock` (нужна и другим модалкам).

### P2 — гигиена репозитория и сборки

| # | Находка | Действие |
|---|---------|----------|
| 1 | Каталог `127.0.0.1/` со сгенерированным `.nuxt` внутри — артефакт кривого запуска dev | Удалить; в `.gitignore` добавить `127.0.0.1/` |
| 2 | Мёртвые компоненты `LimitedTimeOffer` (163 стр.) и `WhatOurCustomersSay` (89 стр.) — упомянуты только в закомментированном коде `index.vue` | Удалить или вернуть в работу — решить |
| 3 | `"vue": "latest"`, `"vue-router": "latest"` в dependencies | Зафиксировать версии (nuxt 4.4.6 несёт свои, явные `latest` — лотерея) |
| 4 | CI (`deploy.yml`) не запускает `lint` и `test:unit` — README предписывает их перед изменениями | Добавить шаги `npm run lint && npm run test:unit` перед build |
| 5 | Клиентские компоненты без типизированных props (`<script setup>` JS), тип `Product` используется только на сервере | Постепенно: `defineProps<{...}>()` с типами из `types/catalog.ts` |
| 6 | `debug.log`, пустой `docs/`, `dist` symlink | почистить |
| 7 | PWA-иконки объявлены дважды в манифесте (`pwa-512x512.png` два раза в `nuxt.config.ts`) | убрать дубль |
| 8 | `import mattressSteps from '/data/mattress-steps.json'` — исходные данные подборщика в корне рядом с публичными путями | Либо перенести подборщик в `content/` (редактируемый через Decap CMS), либо явно оставить `data/` как source-данные и описать в README |

### P3 — тесты на швах

Сейчас 1 тест-файл (34 строки, только группировка каталога). После P1 добавить:
- `normalizeContentProduct` (не покрыт! а это входная точка всех данных);
- `useProductFilters` — фильтр/поиск/сортировка/пагинация;
- расчёт цены товара (`basePrice + surcharges`) — таблица кейсов по опциям;
- `getProductById` + `getProductRoutesFromCatalog` vs `collectJsonFiles` в `nuxt.config.ts`
  (два независимых построителя маршрутов — свести к одному, иначе расходятся).

## 3. Порядок работ

1. **Коммит текущей миграции** (P0.3) — чистое дерево.
2. **Решение по деплою и приёму заявок** (P0.1 + P0.2) — блокирует всё остальное по формам.
3. **Каталог/товар**: `getProductById` + `/api/products/[id].get.ts`, декомпозиция
   `[id].vue` на `useProductPage` (цена как computed, надбавки из данных) — P1.4.
4. **Фильтры**: `category`-проп + `useProductFilters` с тестами — P1.5.
5. **Шов картинок** — P1.6 (скрипт миграции JSON + одна точка префикса).
6. **Формы**: `useSmartCaptcha` + инъекция функции отправки — P1.7 (после решения P0).
7. **Гигиена** — P2, по ходу.
8. **Тесты на швах** — P3, параллельно с шагами 3–5.

Каждый шаг — отдельный коммит/PR; шаги 3–5 независимы друг от друга.
Проверка после каждого шага: `npm run lint && npm run test:unit && npm run generate`.

## 4. Открытые вопросы (решение за человеком)

1. Куда должны попадать заявки с форм: email-уведомление, CRM, сторонний сервис?
2. Целевой деплой выбран: SSG на Timeweb (nginx).
3. Где разместить OAuth-сервис для production-входа Decap CMS?
4. Мёртвые компоненты (`LimitedTimeOffer`, `WhatOurCustomersSay`) — удалить или ждать возвращения в макет?
