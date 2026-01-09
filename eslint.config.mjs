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
      },
    },
    vue: true,
    ignores: [
      '**/fixtures',
      // ...globs
    ],
  }),
)
