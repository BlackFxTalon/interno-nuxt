'use strict'

const assert = require('node:assert/strict')
const { Buffer } = require('node:buffer')
const { EventEmitter } = require('node:events')
const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')
const querystring = require('node:querystring')
const { test } = require('node:test')
const vm = require('node:vm')
const policy = require('../consent-policy.json')

async function fixture({ required = true, legacyUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString() } = {}) {
  const messages = []
  const logs = []
  const receipts = []
  const captchaRequests = []
  const events = []
  const flags = { smtpFailure: false, captchaUnavailable: false, storageFailure: false }
  const fakeProcess = { env: { YANDEX_EMAIL: 'audit@example.invalid', YANDEX_PASSWORD: 'mock-password', SMARTCAPTCHA_SERVER_KEY: 'mock-key', CONSENT_REQUIRED: required ? 'true' : 'false', CONSENT_LEGACY_UNTIL: legacyUntil } }
  function mockRequire(name) {
    if (name === 'node:process')
      return fakeProcess
    if (name === 'dotenv')
      return { config: () => ({}) }
    if (name === './consent-policy.json')
      return policy
    if (name === './consent-store.cjs') {
      return { createConsentStore: () => ({ record: async (document, formId) => {
        events.push('record')
        if (flags.storageFailure)
          throw Object.assign(new Error('private filesystem detail'), { code: 'EACCES' })
        const receipt = { id: '00000000-0000-4000-8000-000000000001', accepted: true, acceptedAt: new Date().toISOString(), formId, documentVersion: document.version, documentPath: document.documentPath, documentSha256: document.documentSha256 }
        receipts.push(receipt)
        return receipt
      } }) }
    }
    if (name === 'nodemailer') {
      return { createTransport: () => ({ sendMail: async (message) => {
        events.push('mail')
        if (flags.smtpFailure)
          throw Object.assign(new Error('private SMTP detail audit@example.invalid'), { code: 'EAUTH' })
        messages.push(message)
        return { messageId: 'mock-only' }
      } }) }
    }
    if (name === 'node:https' || name === 'https') {
      return { request(options, callback) {
        const request = new EventEmitter()
        request.destroy = (error) => {
          if (error)
            request.emit('error', error)
          request.emit('close')
        }
        request.end = (data) => {
          const parsed = querystring.parse(data)
          captchaRequests.push(parsed)
          events.push('captcha')
          process.nextTick(() => {
            if (flags.captchaUnavailable) {
              request.destroy(Object.assign(new Error('private CAPTCHA detail'), { code: 'ETIMEDOUT' }))
              return
            }
            const response = new EventEmitter()
            response.statusCode = 200
            callback(response)
            response.emit('data', Buffer.from(JSON.stringify({ status: parsed.token === 'bad-token' ? 'failed' : 'ok' })))
            response.emit('end')
            request.emit('close')
          })
        }
        return request
      } }
    }
    return require(name)
  }
  mockRequire.main = {}
  const sandbox = {
    require: mockRequire,
    module: { exports: {} },
    process: fakeProcess,
    console: { log() {}, error(...args) { logs.push(args) } },
    Buffer,
    setTimeout,
    clearTimeout,
  }
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../server.cjs'), 'utf8'), sandbox, { filename: 'server.cjs' })
  const server = sandbox.module.exports.listen(0, '127.0.0.1')
  await new Promise(resolve => server.once('listening', resolve))
  const url = `http://127.0.0.1:${server.address().port}`
  let nextIp = 1
  const post = (body, ip = `203.0.113.${nextIp++}`) => fetch(`${url}/api/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': ip },
    body: JSON.stringify(body),
  })
  return {
    url,
    post,
    messages,
    logs,
    receipts,
    captchaRequests,
    events,
    flags,
    close() {
      server.closeAllConnections()
      server.close()
    },
  }
}

const payload = { name: 'Synthetic test', phone: '+70000000000', captchaToken: 'test-token', formId: 'inquiry', consent: { accepted: true, version: policy.version } }

test('baseline validation, optional email, escaping, IP trust, rate limit and private errors', async () => {
  const app = await fixture()
  try {
    const health = await fetch(`${app.url}/healthz`)
    assert.equal(health.status, 200)
    assert.equal(health.headers.get('cache-control'), 'no-store')
    assert.equal(health.headers.get('x-powered-by'), null)
    for (const email of [undefined, '', '   ']) {
      assert.equal((await app.post({ ...payload, ...(email === undefined ? {} : { email }) })).status, 200)
      assert.equal(Object.hasOwn(app.messages.at(-1), 'replyTo'), false)
    }
    assert.equal((await app.post({ ...payload, email: ' audit@example.invalid ' })).status, 200)
    assert.equal(app.messages.at(-1).replyTo, 'audit@example.invalid')
    for (const extra of [
      { name: '' },
      { name: {} },
      { name: 'x'.repeat(121) },
      { phone: '123' },
      { phone: [] },
      { phone: '+7(999)___-__-__' },
      { email: 'invalid' },
      { email: {} },
      { email: 'audit@example.invalid\r\nBcc: bad@example.invalid' },
      { captchaToken: '' },
      { captchaToken: {} },
      { productData: [] },
      { productData: { name: {} } },
      { productData: { color: 'x'.repeat(257) } },
    ]) {
      const before = app.messages.length
      assert.equal((await app.post({ ...payload, ...extra })).status, 400)
      assert.equal(app.messages.length, before)
    }
    assert.equal((await app.post({ ...payload, name: '<img src=x onerror=alert(1)>', productData: { name: '<script>bad</script>', price: 100, color: '<b>red</b>' } })).status, 200)
    assert.ok(!app.messages.at(-1).html.includes('<img'))
    assert.ok(app.messages.at(-1).html.includes('&lt;script&gt;'))
    assert.ok(app.messages.at(-1).html.includes('&lt;b&gt;red&lt;/b&gt;'))
    assert.equal((await app.post({ ...payload, captchaToken: 'bad-token' })).status, 400)
    app.flags.captchaUnavailable = true
    assert.equal((await app.post(payload)).status, 503)
    app.flags.captchaUnavailable = false
    app.flags.smtpFailure = true
    assert.equal((await app.post(payload)).status, 500)
    app.flags.smtpFailure = false
    assert.ok(!JSON.stringify(app.logs).includes('private'))
    assert.ok(!JSON.stringify(app.logs).includes('audit@example.invalid'))
    assert.equal((await app.post(payload, '198.51.100.99, 203.0.113.200')).status, 200)
    assert.equal(app.captchaRequests.at(-1).ip, '203.0.113.200')
    assert.equal((await app.post({ ...payload, extra: 'x'.repeat(17000) })).status, 413)
    const badJson = await fetch(`${app.url}/api/send-email`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })
    assert.equal(badJson.status, 400)
    for (let i = 0; i < 10; i++)
      assert.equal((await app.post({}, '203.0.113.250')).status, 400)
    const limited = await app.post({}, '203.0.113.250')
    assert.equal(limited.status, 429)
    assert.ok(limited.headers.get('ratelimit'))
  }
  finally {
    app.close()
  }
})

test('strict consent rejects missing, false, forged and outdated consent before CAPTCHA or SMTP', async () => {
  const app = await fixture()
  try {
    for (const consent of [undefined, null, { accepted: false }, { accepted: 'true', version: policy.version }])
      assert.equal((await app.post({ ...payload, consent })).status, 400)
    assert.equal((await app.post({ ...payload, consent: { accepted: true, version: 'old' } })).status, 409)
    assert.equal((await app.post({ ...payload, formId: 'unknown' })).status, 400)
    assert.equal(app.captchaRequests.length, 0)
    assert.equal(app.receipts.length, 0)
    assert.equal(app.messages.length, 0)
  }
  finally {
    app.close()
  }
})

test('durable consent precedes mail and its receipt is linked to the message and response', async () => {
  const app = await fixture()
  try {
    const response = await app.post(payload)
    assert.equal(response.status, 200)
    const result = await response.json()
    assert.equal(result.requestId, app.receipts[0].id)
    assert.deepEqual(app.events, ['captcha', 'record', 'mail'])
    assert.ok(app.messages[0].html.includes(policy.version))
    assert.ok(app.messages[0].html.includes(policy.documentSha256))
    assert.ok(app.messages[0].text.includes(result.requestId))
    for (const field of ['name', 'phone', 'email', 'ip', 'captchaToken', 'productData'])
      assert.equal(Object.hasOwn(app.receipts[0], field), false)
  }
  finally {
    app.close()
  }
})

test('failed CAPTCHA creates no receipt and failed persistence prevents email delivery', async () => {
  const app = await fixture()
  try {
    assert.equal((await app.post({ ...payload, captchaToken: 'bad-token' })).status, 400)
    assert.equal(app.receipts.length, 0)
    app.flags.storageFailure = true
    assert.equal((await app.post(payload)).status, 503)
    assert.equal(app.messages.length, 0)
  }
  finally {
    app.close()
  }
})

test('legacy compatibility fails closed without a valid unexpired deadline', async () => {
  for (const legacyUntil of ['', 'invalid', new Date(Date.now() - 1000).toISOString()]) {
    const app = await fixture({ required: false, legacyUntil })
    try {
      assert.equal((await app.post({ ...payload, consent: undefined })).status, 400)
      assert.equal(app.messages.length, 0)
    }
    finally {
      app.close()
    }
  }
})

test('temporary legacy compatibility never invents a consent receipt', async () => {
  const app = await fixture({ required: false })
  try {
    assert.equal((await app.post({ ...payload, consent: undefined, formId: undefined })).status, 200)
    assert.equal(app.receipts.length, 0)
    assert.equal(app.messages[0].text.includes('Согласие:'), false)
    assert.equal((await app.post({ ...payload, consent: { accepted: false } })).status, 400)
  }
  finally {
    app.close()
  }
})
