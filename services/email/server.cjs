'use strict'

require('dotenv').config({ quiet: true })
const { Buffer } = require('node:buffer')
const https = require('node:https')
const process = require('node:process')
const querystring = require('node:querystring')
const cors = require('cors')
const express = require('express')
const { rateLimit } = require('express-rate-limit')
const nodemailer = require('nodemailer')
const policy = require('./consent-policy.json')
const { createConsentStore } = require('./consent-store.cjs')

const consentRequired = process.env.CONSENT_REQUIRED !== 'false'
const legacyUntil = Date.parse(process.env.CONSENT_LEGACY_UNTIL || '')
const consentStore = createConsentStore(process.env.CONSENT_STORAGE_DIR || '/var/lib/interno-email/consents')

const app = express()
app.disable('x-powered-by')
// Only the local Nginx proxy is trusted; arbitrary forwarded headers are not.
app.set('trust proxy', 'loopback')
app.use(cors({ origin: ['https://internomebel.ru', 'https://www.internomebel.ru'] }))
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  next()
})
app.use(express.json({ limit: '16kb', strict: true }))

const submissionsLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Слишком много запросов. Попробуйте позже.' },
})

function escapeHtml(value) {
  const replacements = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }
  return String(value ?? '').replace(/[&<>"']/g, character => replacements[character])
}

function safeErrorCode(error) {
  return typeof error?.code === 'string' && /^[A-Z0-9_]{1,40}$/.test(error.code)
    ? error.code
    : 'UNEXPECTED_ERROR'
}

function hasControlCharacters(value) {
  return Array.from(value).some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)
}

function validateSubmission(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body))
    throw new Error('Некорректные данные формы')

  const limits = { name: 120, email: 254, phone: 32, captchaToken: 8192 }
  const values = {}
  for (const [key, limit] of Object.entries(limits)) {
    const value = key === 'email' && body[key] === undefined ? '' : body[key]
    if (typeof value !== 'string' || value.length > limit || hasControlCharacters(value))
      throw new Error('Некорректные данные формы')
    values[key] = value.trim()
  }
  if (!values.name || !values.phone)
    throw new Error('Имя и телефон обязательны')
  const phoneDigits = values.phone.replace(/\D/g, '')
  if (!/^\+?[\d\s()-]+$/.test(values.phone) || phoneDigits.length < 10 || phoneDigits.length > 15)
    throw new Error('Введите корректный номер телефона')
  if (values.email && !/^[^\s@<>]+@[^\s<>@][^\s.<>@]*\.[^\s<>@]+$/.test(values.email))
    throw new Error('Введите корректный email или оставьте поле пустым')
  if (!values.captchaToken)
    throw new Error('Токен капчи отсутствует')

  let productData
  if (body.productData !== undefined && body.productData !== null) {
    if (typeof body.productData !== 'object' || Array.isArray(body.productData))
      throw new Error('Некорректные данные товара')
    productData = {}
    const allowed = ['name', 'price', 'currentSize', 'height', 'weight', 'color', 'liftingMechanism', 'antivandalVelor', 'robotVacuumCleanerLegs']
    for (const field of allowed) {
      const value = body.productData[field]
      if (value === undefined || value === null)
        continue
      if ((typeof value !== 'string' && typeof value !== 'number')
        || (typeof value === 'number' && !Number.isFinite(value))
        || String(value).length > 256 || hasControlCharacters(String(value))) {
        throw new Error('Некорректные данные товара')
      }
      productData[field] = value
    }
  }
  return { ...values, productData }
}

function validateConsent(body) {
  // Explicit temporary compatibility mode is used only during coordinated deployment.
  if (body.consent === undefined && !consentRequired && Number.isFinite(legacyUntil) && Date.now() < legacyUntil)
    return null
  if (body.consent?.accepted !== true)
    throw Object.assign(new Error('Для отправки заявки необходимо отдельное согласие на обработку персональных данных.'), { status: 400 })
  if (body.consent.version !== policy.version)
    throw Object.assign(new Error('Документ согласия обновлён. Обновите страницу, прочитайте документ и отметьте согласие заново.'), { status: 409 })
  if (!policy.formIds.includes(body.formId))
    throw Object.assign(new Error('Неизвестная форма заявки. Обновите страницу.'), { status: 400 })
  return { formId: body.formId }
}

function checkCaptcha(token, ip) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      secret: process.env.SMARTCAPTCHA_SERVER_KEY,
      token,
      ip,
    })
    let timer
    const request = https.request({
      hostname: 'smartcaptcha.yandexcloud.net',
      port: 443,
      path: '/validate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (response) => {
      let content = ''
      response.on('data', (chunk) => {
        content += chunk
        if (Buffer.byteLength(content) > 8192)
          request.destroy(new Error('Captcha response too large'))
      })
      response.on('error', reject)
      response.on('end', () => {
        if (response.statusCode !== 200) {
          reject(new Error('Captcha validation unavailable'))
          return
        }
        try {
          resolve(JSON.parse(content).status === 'ok')
        }
        catch {
          reject(new Error('Invalid captcha response'))
        }
      })
    })
    request.on('error', reject)
    request.on('close', () => clearTimeout(timer))
    timer = setTimeout(() => request.destroy(new Error('Captcha validation timeout')), 15000)
    timer.unref()
    request.end(postData)
  })
}

function generateProductDetailsHTML(productData) {
  if (!productData)
    return ''
  const rows = [
    ['Товар', productData.name || 'Не указано'],
    ['Цена', productData.price === undefined ? 'Не указано' : `${productData.price} ₽`],
    ['Размер', productData.currentSize || 'Не указано'],
  ]
  for (const [field, label, suffix] of [
    ['height', 'Высота', ' см'],
    ['weight', 'Вес', ' кг'],
    ['color', 'Цвет', ''],
    ['liftingMechanism', 'Подъемный механизм', ''],
    ['antivandalVelor', 'Антивандальный велюр', ''],
    ['robotVacuumCleanerLegs', 'Ножки под робот-пылесос (13 см)', ''],
  ]) {
    if (productData[field] !== undefined && productData[field] !== '')
      rows.push([label, `${productData[field]}${suffix}`])
  }
  return `<h3>Детали заказа:</h3><table style="border-collapse:collapse;width:100%;margin-top:10px">${
    rows.map(([label, value]) => `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9">${escapeHtml(label)}</td><td style="padding:8px;border:1px solid #ddd">${escapeHtml(value)}</td></tr>`).join('')
  }</table>`
}

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
  auth: { user: process.env.YANDEX_EMAIL, pass: process.env.YANDEX_PASSWORD },
})

// Internal liveness endpoint; Nginx does not expose this route.
app.get('/healthz', (req, res) => res.json({ status: 'ok' }))

app.post('/api/send-email', submissionsLimit, async (req, res) => {
  let submission
  let consent
  try {
    submission = validateSubmission(req.body)
    consent = validateConsent(req.body)
  }
  catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message })
  }

  let passed
  try {
    passed = await checkCaptcha(submission.captchaToken, req.ip)
  }
  catch (error) {
    console.error('captcha_validation_unavailable', safeErrorCode(error))
    return res.status(503).json({ success: false, message: 'Проверка капчи временно недоступна. Попробуйте позже.' })
  }
  if (!passed)
    return res.status(400).json({ success: false, message: 'Проверка капчи не пройдена' })

  let receipt
  if (consent) {
    try {
      receipt = await consentStore.record(policy, consent.formId)
    }
    catch (error) {
      console.error('consent_record_failed', safeErrorCode(error))
      return res.status(503).json({ success: false, message: 'Не удалось сохранить подтверждение согласия. Попробуйте позже.' })
    }
  }

  const { name, email, phone, productData } = submission
  const date = new Date().toLocaleString('ru-RU')
  const receiptText = receipt
    ? `\nИдентификатор заявки: ${receipt.id}\nСогласие: подтверждено, версия ${receipt.documentVersion}\nВремя согласия (UTC): ${receipt.acceptedAt}\nДокумент: https://internomebel.ru${receipt.documentPath}\nSHA-256 документа: ${receipt.documentSha256}\nФорма: ${receipt.formId}`
    : ''
  try {
    await transporter.sendMail({
      from: process.env.YANDEX_EMAIL,
      to: process.env.YANDEX_EMAIL,
      ...(email ? { replyTo: email } : {}),
      subject: 'Новая заявка с сайта Интерно',
      text: `Новая заявка с сайта\nИмя: ${name}\nEmail: ${email || 'Не указан'}\nТелефон: ${phone}\nДата заказа: ${date}${receiptText}`,
      html: `<h2>Новая заявка с сайта</h2>
        <p><strong>Имя:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email || 'Не указан')}</p>
        <p><strong>Телефон:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Дата заказа:</strong> ${escapeHtml(date)}</p>
        ${generateProductDetailsHTML(productData)}
        ${receipt ? `<hr><p><strong>Подтверждение согласия:</strong></p><pre style="white-space:pre-wrap">${escapeHtml(receiptText.trim())}</pre>` : ''}`,
    })
    return res.json({ success: true, message: 'Заявка успешно отправлена', ...(receipt ? { requestId: receipt.id } : {}) })
  }
  catch (error) {
    // Never log request bodies, addresses, CAPTCHA tokens or raw SMTP errors.
    console.error('email_send_failed', safeErrorCode(error))
    return res.status(500).json({ success: false, message: 'Ошибка отправки' })
  }
})

app.use((error, req, res, next) => {
  if (res.headersSent)
    return next(error)
  if (error.type === 'entity.too.large')
    return res.status(413).json({ success: false, message: 'Слишком большой запрос' })
  if (error.type === 'entity.parse.failed')
    return res.status(400).json({ success: false, message: 'Некорректный JSON' })
  console.error('request_failed', safeErrorCode(error))
  return res.status(500).json({ success: false, message: 'Ошибка обработки запроса' })
})

if (require.main === module) {
  const port = Number(process.env.PORT || 3001)
  const server = app.listen(port, '127.0.0.1', () => console.log(`Email service listening on 127.0.0.1:${port}; consent required: ${consentRequired}`))
  process.once('SIGTERM', () => {
    server.close(() => process.exit(0))
    const deadline = setTimeout(() => {
      server.closeAllConnections()
      process.exit(1)
    }, 40000)
    deadline.unref()
  })
}
module.exports = app
