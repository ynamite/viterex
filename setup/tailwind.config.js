/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    fontFamily: {
      suissecuts: ['Suisse Cuts', 'sans-serif']
    },
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
