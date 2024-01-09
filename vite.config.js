import { defineConfig } from 'vite'
import liveReload from 'vite-plugin-live-reload'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    //vue(),
    liveReload(__dirname + '/**/*.php')
  ],

  // config
  root: '',
  base: process.env.NODE_ENV === 'development' ? '/' : '/public/assets/dist/',

  build: {
    // output dir for production build
    outDir: resolve(__dirname, './public/assets/dist'),
    emptyOutDir: true,

    // emit manifest so PHP can find the hashed files
    manifest: true,

    // esbuild target
    // target: 'es2018',

    // our entry
    rollupOptions: {
      input: {
        main: resolve(__dirname + '/main.js')
      }

      /*
      output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`
      }*/
    },

    // minifying switch
    minify: true,
    write: true
  },

  server: {
    // required to load scripts from custom host
    cors: {
      cors: {
        origin: '*'
        // methods: ["GET", "POST"],
        // allowedHeaders: ["Content-Type", "Authorization"],
      },
      preflightContinue: true
    },
    // we need a strict port to match on PHP side
    // change freely, but update in your functions.php to match the same port
    strictPort: true,
    port: 3000,

    // serve over http
    https: false,

    // serve over httpS
    // to generate localhost certificate follow the link:
    // https://github.com/FiloSottile/mkcert - Windows, MacOS and Linux supported - Browsers Chrome, Chromium and Firefox (FF MacOS and Linux only)
    // installation example on Windows 10:
    // > choco install mkcert (this will install mkcert)
    // > mkcert -install (global one time install)
    // > mkcert localhost (in project folder files localhost-key.pem & localhost.pem will be created)
    // uncomment below to enable https
    //https: {
    //  key: fs.readFileSync('localhost-key.pem'),
    //  cert: fs.readFileSync('localhost.pem'),
    //},

    hmr: {
      host: 'localhost'
      //port: 443
    }
  }
})
