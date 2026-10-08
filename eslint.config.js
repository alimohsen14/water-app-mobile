const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const i18next = require("eslint-plugin-i18next");
const prettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    ...i18next.configs["flat/recommended"],
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
  },
  prettierRecommended,
]);
