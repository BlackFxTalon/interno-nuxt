import { execFileSync } from 'node:child_process'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

function runNode(source: string): string {
  return execFileSync(process.execPath, ['--input-type=module', '-e', source], {
    cwd: new URL('../', import.meta.url),
    encoding: 'utf8',
    timeout: 15000,
  }).trim()
}

describe('native dependencies', () => {
  it('loads PWA and Nuxt Image sharp in the same process', () => {
    // Loading the older PWA libvips first used to break Nuxt Image on Windows.
    expect(runNode(`
      import assert from 'node:assert/strict';
      import { createRequire } from 'node:module';
      const require = createRequire(import.meta.url);
      const pwaRequire = createRequire(require.resolve('@vite-pwa/assets-generator'));
      const pwaSharp = pwaRequire('sharp');
      const sharp = require('sharp');
      const icoRequire = createRequire(pwaRequire.resolve('sharp-ico'));
      assert.equal(pwaSharp, sharp);
      assert.equal(icoRequire('sharp'), sharp);
      const { info } = await sharp({
        create: { width: 1, height: 1, channels: 4, background: '#0580C7' },
      }).png().toBuffer({ resolveWithObject: true });
      assert.equal(info.format, 'png');
      console.log('ok');
    `)).toBe('ok')
  })

  it('opens a SQLite database with the current Node ABI', () => {
    expect(runNode(`
      import assert from 'node:assert/strict';
      import Database from 'better-sqlite3';
      const db = new Database(':memory:');
      try {
        assert.equal(db.prepare('SELECT 1 AS value').get().value, 1);
      } finally {
        db.close();
      }
      console.log('ok');
    `)).toBe('ok')
  })
})
