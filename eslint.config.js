const tseslint = require("typescript-eslint");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const reactNativePlugin = require("eslint-plugin-react-native");
const tanstackQueryPlugin = require("@tanstack/eslint-plugin-query");

module.exports = tseslint.config(
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "dist/**",
      "android/**",
      "ios/**",
      "web-build/**",
      "*.config.js",
      "*.config.ts",
    ],
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-native": reactNativePlugin,
      "@tanstack/query": tanstackQueryPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...tanstackQueryPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-native/no-unused-styles": "off",
      "react-native/no-inline-styles": "off",
      "react-native/no-raw-text": "off",
      "react-native/no-color-literals": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  }
);
