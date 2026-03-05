/** @type {import('tailwindcss').Config} */
import fluid, { extract, screens, fontSize } from 'fluid-tailwind'

module.exports = {
  content: {
    files: [
      './assets/js/**/*.js',
      './assets/css/**/*.css',
      './src/fragments/**/*.php',
      './src/templates/**/*.php',
      './src/modules/**/*.php',
      './src/addons/project/**/*.php'
    ],
    extract
  },
  theme: {
        screens,
    fontSize,

    fontFamily: {
      roboto: ['Roboto', 'sans-serif']
    }
  },
  plugins: [
    fluid({
      checkSC144: false // default: true
    })
  ]
}
