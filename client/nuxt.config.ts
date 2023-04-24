import { defineNuxtConfig } from "nuxt/config";
import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";

const { BASE_URL } = process.env;

export default defineNuxtConfig({
  ssr: true,

  runtimeConfig: {
    public: {
      baseUrl: `http://${BASE_URL}`,
    },
  },

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
          target: `http://${BASE_URL}`,
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(/^\/api/, "");
          },
        },
        "/socket.io": {
          target: `ws://${BASE_URL}`,
          ws: true,
        },
      },
    },
  },

  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },
    routeRules: {
      "/api/**": { proxy: `http://${BASE_URL}/**` },
      "/socket.io/**": { proxy: `http://${BASE_URL}/socket.io/**` },
    },
  },

  // build modules
  modules: [
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "nuxt-typed-router",
    "@nuxtjs/color-mode",
    "nuxt-highcharts",
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
