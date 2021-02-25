/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

const defaultTheme = require("tailwindcss/defaultTheme"); // eslint-disable-line
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      red: colors.red,
      blue: colors.blue,
      yellow: colors.yellow,
      "black-900": "#141414",
      "black-800": "#1a1a1a",
      "black-700": "#202020",
      "black-600": "#2a2a2a",
      "black-500": "#323232",
    },
    fontFamily: {
      mono: [
        "Menlo",
        "Monaco",
        '"Lucida Console"',
        "Consolas",
        '"Liberation Mono"',
        '"Courier New"',
        "monospace",
      ],
    },
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      width: {
        72: "18rem",
      },
    },
  },
  variants: {},
  plugins: [require("tailwindcss-hyphens")],
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: [
      "./components/**/*.tsx",
      "./pages/**/*.tsx",
      "./public/posts/*.json",
    ],
  },
};
