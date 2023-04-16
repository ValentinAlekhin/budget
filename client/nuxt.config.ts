import { defineNuxtConfig } from "nuxt/config";
import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: true,

  app: {
    // head
    head: {
      title: "Бюджет",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "Бюджет",
          name: "Бюджет",
          content: "Бюджет",
        },
      ],
      htmlAttrs: {
        class: "dark",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  hooks: {
    "vite:extendConfig": (config) => {
      config.plugins?.push(optimizeLodashImports());
    },
  },

  imports: {
    dirs: ["store"],
  },

  // css
  css: ["~/assets/scss/index.scss"],

  typescript: {
    strict: true,
    shim: false,
  },

  plugins: ["@/plugins/antd", "@/plugins/draggable"],

  vite: {
    server: {
      proxy: {
        "/api": {
          target: "http:/localhost:3001",
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(/^\/api/, "");
          },
        },
        "/socket.io": {
          target: "ws://localhost:3001",
          ws: true,
        },
      },
    },
  },

  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },
    routeRules: {
      "/api/**": { proxy: "http:/localhost:3001/**" },
      "/socket.io/**": { proxy: "http:/localhost:3001/socket.io/**" },
    },
  },

  // build modules
  modules: [
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "nuxt-typed-router",
    "@nuxtjs/color-mode",
  ],

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

  devtools: false,
});
