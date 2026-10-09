'use strict'

const assert = require('node:assert/strict')
const { execFileSync } = require('node:child_process')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const process = require('node:process')
const { test } = require('node:test')
const policy = require('../consent-policy.json')
const { createConsentStore } = require('../consent-store.cjs')

async function withStore(callback) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'interno-consent-test-'))
  try {
    await callback(createConsentStore(directory), directory)
  }
  finally {
    await fs.rm(directory, { recursive: true, force: true })
  }
}

test('receipts contain only minimal evidence, with a fixed expiry and private file modes', async () => {
  await withStore(async (store, directory) => {
    const now = new Date('2026-01-01T00:00:00.000Z')
    const receipt = await store.record(policy, 'order', now)
    assert.equal(receipt.expiresAt, '2026-04-01T00:00:00.000Z')
    const file = path.join(directory, `${receipt.id}.json`)
    assert.deepEqual(JSON.parse(await fs.readFile(file, 'utf8')), receipt)
    assert.deepEqual(Object.keys(receipt).sort(), ['id', 'accepted', 'acceptedAt', 'expiresAt', 'formId', 'documentVersion', 'documentPath', 'documentSha256'].sort())
    assert.equal((await fs.readdir(directory)).length, 1)
    if (process.platform !== 'win32') {
      assert.equal((await fs.stat(file)).mode & 0o777, 0o600)
      assert.equal((await fs.stat(directory)).mode & 0o777, 0o700)
    }
  })
})

test('prune is dry-run by default and deletes only expired valid receipts', async () => {
  await withStore(async (store, directory) => {
    const expired = await store.record(policy, 'inquiry', new Date('2026-01-01T00:00:00Z'))
    const fresh = await store.record(policy, 'inquiry', new Date('2026-04-01T00:00:00Z'))
    const now = new Date('2026-04-01T00:00:00Z')
    assert.equal((await store.prune({ now })).deleted, 0)
    assert.equal((await fs.readdir(directory)).length, 2)
    assert.equal((await store.prune({ now, execute: true })).deleted, 1)
    await assert.rejects(fs.access(path.join(directory, `${expired.id}.json`)))
    await fs.access(path.join(directory, `${fresh.id}.json`))
  })
})

test('targeted erasure requires an explicit execute flag and refuses path traversal', async () => {
  await withStore(async (store, directory) => {
    const receipt = await store.record(policy, 'inquiry')
    assert.deepEqual(await store.remove(receipt.id), { found: true, deleted: false })
    await fs.access(path.join(directory, `${receipt.id}.json`))
    await assert.rejects(store.remove('../../outside'))
    assert.deepEqual(await store.remove(receipt.id, { execute: true }), { found: true, deleted: true })
    assert.deepEqual(await store.remove(receipt.id, { execute: true }), { found: false, deleted: false })
  })
})

test('corrupt evidence is reported, not silently destroyed', async () => {
  await withStore(async (store, directory) => {
    const filename = '00000000-0000-4000-8000-000000000001.json'
    await fs.writeFile(path.join(directory, filename), '{')
    const result = await store.prune({ execute: true })
    assert.equal(result.invalid, 1)
    assert.equal(result.deleted, 0)
    await fs.access(path.join(directory, filename))
  })
})

test('abandoned atomic-write files are cleaned only after a day', async () => {
  await withStore(async (store, directory) => {
    const file = path.join(directory, '00000000-0000-4000-8000-000000000001.json.tmp')
    await fs.writeFile(file, 'incomplete synthetic data')
    await fs.utimes(file, new Date('2026-01-01'), new Date('2026-01-01'))
    const result = await store.prune({ execute: true, now: new Date('2026-01-03') })
    assert.equal(result.temporaryDeleted, 1)
  })
})

test('the operator CLI defaults to dry-run and logs no subject identifiers', async () => {
  await withStore(async (store, directory) => {
    const receipt = await store.record(policy, 'inquiry', new Date('2025-01-01T00:00:00Z'))
    const script = path.join(__dirname, '../scripts/consents-admin.cjs')
    const output = execFileSync(process.execPath, [script, 'prune'], { env: { ...process.env, CONSENT_STORAGE_DIR: directory }, encoding: 'utf8' })
    assert.equal(JSON.parse(output).dryRun, true)
    assert.equal(JSON.parse(output).deleted, 0)
    assert.equal(output.includes(receipt.id), false)
    await fs.access(path.join(directory, `${receipt.id}.json`))
  })
})
