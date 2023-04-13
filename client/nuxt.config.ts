import { defineNuxtConfig } from "nuxt/config";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: false,
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

  imports: {
    dirs: ["store"],
  },

  // css
  css: ["~/assets/scss/index.scss"],

  typescript: {
    strict: true,
    shim: false,
  },

  plugins: ["@/plugins/antd"],

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
      },
    },
  },

  // build modules
  modules: ["@vueuse/nuxt", "@unocss/nuxt", "@pinia/nuxt"],

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
});
