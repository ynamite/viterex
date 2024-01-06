import { defineConfig } from 'vite'
import usePHP from 'vite-plugin-php'

export default defineConfig({
  plugins: [
    usePHP({
      // binary: '/opt/lampp/bin/php-8.1.10',
      entry: [
        './public/index.php',
        './src/addons/**/*.php',
        './var/data/developer/**/*.php'
      ]
    })
  ]
})
