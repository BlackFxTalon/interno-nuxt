import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Express uses node:test in its own package; do not execute it twice in Vitest.
    include: ['tests/**/*.test.ts'],
  },
})
