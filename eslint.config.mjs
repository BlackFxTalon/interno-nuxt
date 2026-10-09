import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // your custom flat configs go here, for example:
  antfu({
    // ...@antfu/eslint-config options
    type: 'app',
    stylistic: {
      indent: 2,
    },
    typescript: {
      overrides: {
        'no-console': 'off', // allow console.log in TypeScript files
        'ts/no-explicit-any': 'error',
      },
    },
    vue: true,
    ignores: [
      '**/fixtures',
      // ...globs
    ],
  }),
  {
    files: ['public/admin/**/*.js', 'public/sw-privacy-cleanup.js', 'scripts/**/*.mjs', 'services/email/**/*.cjs'],
    rules: {
      // The TS rule misclassifies Espree value references with ESLint 10.
      // Use ESLint's native unused-variable checks for these plain-JS files.
      'unused-imports/no-unused-vars': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['services/email/**/*.cjs'],
    rules: { 'no-console': 'off' }, // Service/maintenance output goes to the private journal.
  },
)
