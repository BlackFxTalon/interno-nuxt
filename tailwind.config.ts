import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: '#0580C7',
      },
      fontFamily: {
        // sans: ['Inter', 'system-ui', 'sans-serif'],
        Manrope: ['Manrope', 'sans-serif'],
      }
    }
  }
} satisfies Config