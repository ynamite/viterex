/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './assets/js/**/*.js',
    './assets/css/**/*.css',
    // './src/addons/**/*.php',
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
      fontSize: {
        base: ['1.25rem', { lineHeight: '1.3' }]
      },
      padding: {
        '30px': '30px'
      }
    }
  },
  plugins: [addDynamicIconSelectors()]
}
