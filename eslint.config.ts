import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended, // قواعد JavaScript الأساسية
  pluginReact.configs.flat.recommended, // قواعد React
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          semi: true,
          singleQuote: false,
          printWidth: 80,
          tabWidth: 2,
          trailingComma: "es5",
        },
      ],
      "react/react-in-jsx-scope": "off", // React 17+ مش محتاج import React
    },
  },
]);
