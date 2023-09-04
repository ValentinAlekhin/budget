import { defineNuxtConfig } from "nuxt/config";
import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";

const { BASE_URL } = process.env;

export default defineNuxtConfig({
  ssr: false,

  runtimeConfig: {
    public: {
      baseUrl: `http://${BASE_URL}`,
    },
  },

  app: {
    head: {
      title: "Budget",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
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
      "/socket.io/**": { proxy: `ws://${BASE_URL}/socket.io/**` },
    },
  },

  colorMode: {
    classSuffix: "",
    fallback: "dark",
  },

  modules: [
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "nuxt-typed-router",
    "@nuxtjs/color-mode",
    "nuxt-highcharts",
    "@nuxthq/ui",
  ],

  ui: {
    icons: ["heroicons"],
  },

  components: true,

  vueuse: {
    ssrHandlers: true,
  },

  devtools: true,
});
