import { defineNuxtConfig } from 'nuxt/config'
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin'

const { DOMAIN, HTTP_PROTOCOL, WEBSOCKET_PROTOCOL } = process.env

console.log(DOMAIN)
console.log(HTTP_PROTOCOL)
console.log(WEBSOCKET_PROTOCOL)

export default defineNuxtConfig({
  ssr: false,
  spaLoadingTemplate: 'spa-loading-template.html',

  runtimeConfig: {
    public: {
      domain: DOMAIN,
      httpProtocol: HTTP_PROTOCOL,
      websocketProtocol: WEBSOCKET_PROTOCOL,
    },
  },

  app: {
    head: {
      title: 'Budget',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1',
        },
        {
          name: 'theme-color',
          content: '#030712',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  imports: {
    dirs: ['store'],
  },

  typescript: {
    strict: true,
    shim: false,
  },

  plugins: [
    '@/plugins/draggable',
    '@/plugins/chartjs',
    '@/plugins/infinite-loading',
  ],

  vite: {
    server: {
      proxy: {
        '/api': {
          target: `http://${DOMAIN}`,
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(/^\/api/, '')
          },
        },
        '/socket.io': {
          target: `ws://${DOMAIN}`,
          ws: true,
        },
        '/ws': {
          target: `ws://${DOMAIN}`,
          ws: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
    plugins: [optimizeLodashImports()],
  },

  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },
    routeRules: {
      '/api/**': { proxy: `http://${DOMAIN}/**` },
      '/socket.io/**': { proxy: `ws://${DOMAIN}/socket.io/**` },
      '/ws/**': { proxy: `ws://${DOMAIN}/ws/**` },
    },
  },

  colorMode: {
    classSuffix: '',
    fallback: 'dark',
  },

  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-typed-router',
    '@nuxtjs/color-mode',
    'nuxt-highcharts',
    '@nuxt/ui',
    'nuxt-icon',
    '@vite-pwa/nuxt',
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/i18n',
  ],

  pwa: {
    manifest: {
      name: 'Budget',
      short_name: 'Budget',
      theme_color: '#030712',
      background_color: '#030712',
      icons: [
        {
          src: '/pwa/android/android-launchericon-512-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/pwa/android/android-launchericon-192-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa/android/android-launchericon-144-144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/pwa/android/android-launchericon-96-96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: '/pwa/android/android-launchericon-72-72.png',
          sizes: '72x72',
          type: 'image/png',
        },
        {
          src: '/pwa/android/android-launchericon-48-48.png',
          sizes: '48x48',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },

  ui: {
    icons: ['heroicons'],
  },

  components: {
    global: true,
    dirs: ['~/components'],
  },

  vueuse: {
    ssrHandlers: true,
  },

  i18n: {
    vueI18n: './i18n.config.ts',
    defaultLocale: 'en',
    // @ts-ignore
    setLocaleCookie: true,
    getLocaleCookie: 'i18n',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n',
      alwaysRedirect: true,
    },
    locales: [
      {
        code: 'en',
        name: 'English',
      },
      {
        code: 'ru',
        name: 'Русский',
      },
    ],
  },

  devtools: true,
})
