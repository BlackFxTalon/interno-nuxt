'use strict'

const { randomUUID } = require('node:crypto')
const fs = require('node:fs/promises')
const path = require('node:path')
const process = require('node:process')

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const DAY = 24 * 60 * 60 * 1000

function createConsentStore(directory) {
  if (!path.isAbsolute(directory))
    throw new Error('Consent storage must use an absolute path')

  async function ensureDirectory() {
    await fs.mkdir(directory, { recursive: true, mode: 0o700 })
    await fs.chmod(directory, 0o700)
  }

  async function record(policy, formId, now = new Date()) {
    await ensureDirectory()
    const id = randomUUID()
    const receipt = {
      id,
      accepted: true,
      acceptedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + policy.retentionDays * DAY).toISOString(),
      formId,
      documentVersion: policy.version,
      documentPath: policy.documentPath,
      documentSha256: policy.documentSha256,
    }
    const target = path.join(directory, `${id}.json`)
    const temporary = `${target}.tmp`
    const handle = await fs.open(temporary, 'wx', 0o600)
    try {
      try {
        await handle.writeFile(`${JSON.stringify(receipt)}\n`, 'utf8')
        await handle.sync()
      }
      finally {
        await handle.close()
      }
      await fs.rename(temporary, target)
    }
    catch (error) {
      await fs.rm(temporary, { force: true }).catch(() => {})
      throw error
    }
    // Persist the rename before permitting SMTP delivery.
    if (process.platform !== 'win32') {
      const folder = await fs.open(directory, 'r')
      try {
        await folder.sync()
      }
      finally {
        await folder.close()
      }
    }
    return receipt
  }

  async function prune({ execute = false, now = new Date() } = {}) {
    await ensureDirectory()
    const result = { expired: 0, deleted: 0, invalid: 0, temporaryDeleted: 0 }
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.json.tmp') && UUID.test(entry.name.slice(0, -9))) {
        const temporary = path.join(directory, entry.name)
        const stat = await fs.stat(temporary)
        if (execute && stat.mtimeMs <= now.getTime() - DAY) {
          await fs.unlink(temporary)
          result.temporaryDeleted++
        }
        continue
      }
      if (!entry.isFile() || !entry.name.endsWith('.json') || !UUID.test(entry.name.slice(0, -5)))
        continue
      const file = path.join(directory, entry.name)
      let receipt
      try {
        receipt = JSON.parse(await fs.readFile(file, 'utf8'))
      }
      catch (error) {
        if (error.code === 'ENOENT')
          continue
        result.invalid++
        continue
      }
      const expires = Date.parse(receipt.expiresAt)
      if (!Number.isFinite(expires) || receipt.id !== entry.name.slice(0, -5)) {
        result.invalid++
        continue
      }
      if (expires <= now.getTime()) {
        result.expired++
        if (execute) {
          await fs.unlink(file)
          result.deleted++
        }
      }
    }
    return result
  }

  async function remove(id, { execute = false } = {}) {
    if (!UUID.test(id))
      throw new Error('Invalid receipt identifier')
    const file = path.join(directory, `${id}.json`)
    try {
      await fs.access(file)
      if (execute)
        await fs.unlink(file)
      return { found: true, deleted: execute }
    }
    catch (error) {
      if (error.code === 'ENOENT')
        return { found: false, deleted: false }
      throw error
    }
  }

  return { record, prune, remove }
}

module.exports = { createConsentStore }
