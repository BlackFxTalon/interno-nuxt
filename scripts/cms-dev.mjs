import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const packagePath = require.resolve('decap-server/package.json')
const { bin } = require(packagePath)
const root = fileURLToPath(new URL('../', import.meta.url))

// This unauthenticated filesystem proxy is strictly for local editing.
const server = spawn(process.execPath, [resolve(dirname(packagePath), bin['decap-server'])], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    BIND_HOST: '127.0.0.1',
    PORT: '8081',
    ORIGIN: 'http://localhost:3000',
    MODE: 'fs',
    GIT_REPO_DIRECTORY: root,
  },
})

server.on('error', (error) => {
  console.error('Не удалось запустить локальный Decap proxy:', error)
  process.exitCode = 1
})
server.on('exit', code => process.exit(code ?? 0))
process.on('SIGINT', () => server.kill('SIGINT'))
process.on('SIGTERM', () => server.kill('SIGTERM'))
