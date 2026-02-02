// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@nuxt/eslint",
    "@pinia/nuxt",
  ],

  router: {
    options: {
      strict: true,
    },
  },

  devtools: { enabled: true },

  compatibilityDate: "2025-07-15",

  typescript: {
    typeCheck: false,
    shim: false,
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },

  css: ["vue3-toastify/dist/index.css"],

  i18n: {
    locales: [
      { code: "vi", iso: "vi-VN", name: "Tiếng Việt", file: "vi.json" },
      { code: "en", iso: "en-US", name: "English", file: "en.json" },
    ],
    langDir: "locales",
    defaultLocale: "vi",
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      alwaysRedirect: true,
    },
  },
});
