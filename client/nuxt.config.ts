import { defineNuxtConfig } from "nuxt/config";

const { BASE_URL } = process.env;

export default defineNuxtConfig({
  ssr: false,
  spaLoadingTemplate: "spa-loading-template.html",

  runtimeConfig: {
    public: {
      baseUrl: `http://${BASE_URL}`,
    },
  },

  app: {
    head: {
      title: "Budget",
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1",
        },
        {
          name: "theme-color",
          content: "#030712",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  imports: {
    dirs: ["store"],
  },

  typescript: {
    strict: true,
    shim: false,
  },

  plugins: ["@/plugins/draggable"],

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
    build: {
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
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

  components: {
    global: true,
    dirs: ["~/components"],
  },

  vueuse: {
    ssrHandlers: true,
  },

  devtools: true,
});
