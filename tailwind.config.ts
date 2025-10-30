import type { Config } from 'tailwindcss'

import plugin from 'tailwindcss/plugin'

const rotate = plugin(function ({ addUtilities }) {
  addUtilities({
    '.rotate-y-180': {
      transform: 'rotateY(180deg)',
    },
    '.rotate-x-180': {
      transform: 'rotateX(180deg)',
    },
    '.rotate-180': {
      transform: 'rotate(180deg)',
    },
  })
})

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Mona Sans', 'sans-serif'],
      },
      keyframes: {
        shine: {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },
      },
      animation: {
        shine: 'shine 5s linear infinite',
      },
      colors: {
        background: '#0d0313',
      },
    },
  },
  plugins: [rotate, require('daisyui')],
}

export default config
