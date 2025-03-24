import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // your custom flat configs go here, for example:
  antfu({
    // ...@antfu/eslint-config options
    stylistic: true,
    typescript: true,
    vue: true,
    ignores: [
      '**/fixtures',
      // ...globs
    ],
  }),
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-console': 'off', // allow console.log in TypeScript files
    },
  },
)
