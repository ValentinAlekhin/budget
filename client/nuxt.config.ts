import { defineNuxtConfig } from 'nuxt/config'
import ElementPlus from 'unplugin-element-plus/vite'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  app: {
    // head
    head: {
      title: 'Бюджет',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'Бюджет',
          name: 'Бюджет',
          content: 'Бюджет',
        },
      ],
      htmlAttrs: {
        class: 'dark',
      },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    }
  },

  imports: {
    dirs: ['store'],
  },

  // css
  css: ['~/assets/scss/index.scss'],

  // build
  build: {
    transpile: ['element-plus/es'],
  },

  typescript: {
    strict: true,
    shim: false,
  },

  vite: {
    plugins: [ElementPlus()],
    server: {
      proxy: {
        '/api': {
          target: 'http:/localhost:3001',
          changeOrigin: true,
          rewrite: (path) => {
            console.log(path)
            return path.replace(/^\/api/, '')
          },
        }
      }
    }
  },

  // build modules
  modules: ['@vueuse/nuxt', '@unocss/nuxt', '@pinia/nuxt',],

  // auto import components
  components: true,

  // vueuse
  vueuse: {
    ssrHandlers: true,
  },

  unocss: {
    uno: true,
    attributify: true,
    icons: {
      scale: 1.2,
    },
  },
})