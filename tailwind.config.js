/** @type {import('tailwindcss').Config} */
import { addDynamicIconSelectors } from '@iconify/tailwind'
import fluid, {
  extract,
  screens, fontSize
} from 'fluid-tailwind'

module.exports = {
  content: {
    files: [
      './assets/js/**/*.js',
      './assets/css/**/*.css',
      './src/fragments/**/*.php',
      './src/templates/**/*.php',
      './src/modules/**/*.php'
    ],
    extract
  },
  theme: {
    screens, fontSize,
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
  plugins: [
    addDynamicIconSelectors(),
    require('vidstack/tailwind.cjs')({
      // Optimize output by specifying player selector.
      prefix: 'media',
      selector: '.media-player',
      // Enables more efficient selectors.
      webComponents: true
    }),
    fluid({
      checkSC144: false // default: true
    })
  ]
}
