/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

const defaultTheme = require("tailwindcss/defaultTheme"); // eslint-disable-line

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "active"],
  },
  plugins: [require("@tailwindcss/ui")],
};
