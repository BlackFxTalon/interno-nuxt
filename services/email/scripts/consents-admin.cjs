'use strict'

const process = require('node:process')
const { createConsentStore } = require('../consent-store.cjs')

async function main() {
  const [command, ...args] = process.argv.slice(2)
  const directory = process.env.CONSENT_STORAGE_DIR || '/var/lib/interno-email/consents'
  const store = createConsentStore(directory)
  const execute = args.includes('--execute')
  if (command === 'prune') {
    const result = await store.prune({ execute })
    console.log(JSON.stringify({ operation: 'prune', dryRun: !execute, ...result }))
    if (result.invalid)
      process.exitCode = 2
    return
  }
  if (command === 'delete') {
    const index = args.indexOf('--id')
    if (index === -1 || !args[index + 1])
      throw new Error('Use delete --id UUID [--execute]')
    const result = await store.remove(args[index + 1], { execute })
    // Do not log IDs or subject data.
    console.log(JSON.stringify({ operation: 'delete', dryRun: !execute, ...result }))
    return
  }
  throw new Error('Use prune [--execute] or delete --id UUID [--execute]')
}

main().catch(() => {
  console.error('Consent maintenance failed; no personal data included in this error')
  process.exitCode = 1
})
