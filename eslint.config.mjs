// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    // Bắt buộc dùng spaces, không dùng tabs
    "@stylistic/indent": ["error", 2], // 2 spaces
    "@stylistic/no-tabs": "error", // Cấm tabs
    "vue/html-indent": ["error", 2], // Vue template: 2 spaces,
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: {
          max: 5, // Cho phép tối đa 5 attributes trên 1 dòng
        },
        multiline: {
          max: 1,
        },
      },
    ],
    "vue/singleline-html-element-content-newline": "off",
  },
});
