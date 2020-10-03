const defaultTheme = require("tailwindcss/defaultTheme"); // eslint-disable-line

module.exports = {
  experimental: {
    darkModeVariant: true,
  },
  theme: {
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
        "72": "18rem",
      },
      screens: {
        dark: { raw: "(prefers-color-scheme: dark)" },
      },
      colors: {
        grey: {
          "100": "#F7F7F7",
          "200": "#E1E1E1",
          "300": "#CFCFCF",
          "400": "#B1B1B1",
          "500": "#626262",
          "600": "#515151",
          "700": "#3B3B3B",
          "800": "#222222",
          "900": "#1e1e1e",
        },
      },
    },
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "active"],
  },
  plugins: [require("@tailwindcss/ui"), require("tailwindcss-hyphens")],
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: [
      "./components/**/*.tsx",
      "./pages/**/*.tsx",
      "./public/posts/*.json",
    ],
  },
};
