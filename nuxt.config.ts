// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@nuxt/eslint",
  ],

  devtools: { enabled: true },

  compatibilityDate: "2025-07-15",

  eslint: {
    config: {
      stylistic: false, // 👈 Tắt hẳn stylistic rules
    },
  },

  i18n: {
    locales: [
      { code: "vi", iso: "vi-VN", name: "Tiếng Việt", file: "vi.json" },
      { code: "en", iso: "en-US", name: "English", file: "en.json" },
    ],
    langDir: "locales",
    defaultLocale: "vi",
    strategy: "prefix_except_default",
  },
});
