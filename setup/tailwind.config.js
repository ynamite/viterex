/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './assets/js/**/*.js',
    './assets/css/**/*.css',
    './src/addons/**/*.php',
    './var/data/developer/**/*.php'
  ],
  theme: {
    // fontFamily: {
    //   suissecuts: ['Suisse Cuts', 'sans-serif']
    // },
    colors: {
      primary: '#000000',
      eggshell: '#e7eae1'
    },
    extend: {
      fontSize: {
        base: ['1.25rem', { lineHeight: '1.3' }]
      },
      padding: {
        '30px': '30px'
      }
    }
  },
  plugins: []
}
