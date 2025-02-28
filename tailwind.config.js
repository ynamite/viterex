/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './assets/js/**/*.js',
      './assets/css/**/*.css',
      './src/fragments/**/*.php',
      './src/templates/**/*.php',
      './src/modules/**/*.php',
      './src/addons/project/**/*.php'
  ],
  theme: {
    fontFamily: {
      roboto: ['Roboto', 'sans-serif']
    }
  },
  plugins: []
}
