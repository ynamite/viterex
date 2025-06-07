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
      './src/modules/**/*.php',
      './src/addons/massif/**/*.php',
      './src/addons/project/**/*.php'
    ],
    extract
  },
  theme: {
    screens, fontSize,
    fontFamily: {
      sans: ['Roboto', 'sans-serif']
    },
    extend: {
      colors: {
        primary:
          'hsl(from var(--clr-primary) h s l / calc(100% * <alpha-value>))',
        secondary: 'hsl(from var(--clr-secondary) h s l / <alpha-value>)',
        accent: 'hsl(from var(--clr-accent) h s l / calc(100% * <alpha-value>))'
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography')({
      className: 'tw-prose'
    }),
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
