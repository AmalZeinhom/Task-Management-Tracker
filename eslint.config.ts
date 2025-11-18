import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended, // قواعد JavaScript الأساسية
  ...tseslint.configs.recommended, // قواعد TypeScript
  pluginReact.configs.flat.recommended, // قواعد React
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // ✅ دعم TypeScript
    languageOptions: {
      parser: tseslint.parser, // ✅ استخدم parser الخاص بـ TypeScript
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
          "comma-dangle": "off",
        },
      ],
      "react/react-in-jsx-scope": "off", // مش محتاج import React في React 17+
      "@typescript-eslint/no-explicit-any": "off", // لتفادي التحذير لما استخدم any
    },
  },
]);
