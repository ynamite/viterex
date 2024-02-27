/** @type {import('tailwindcss').Config} */
import { addDynamicIconSelectors } from '@iconify/tailwind'

module.exports = {
  content: [
    './assets/js/**/*.js',
    './assets/css/**/*.css',
    './src/fragments/**/*.php',
    './src/templates/**/*.php',
    './src/modules/**/*.php'
  ],
  theme: {
    fontFamily: {
      roboto: ['Roboto', 'sans-serif']
    },
    extend: {
      colors: {
        primary: '#2F5A33',
        accent: '#9F8158',
      },
    }
  },
  plugins: [addDynamicIconSelectors()]
}
