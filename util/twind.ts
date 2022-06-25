import { IS_BROWSER } from "$fresh/runtime.ts";
import { apply, Configuration, setup } from "twind";
export * from "twind";
export { css } from "twind/css";
export const config: Configuration = {
  darkMode: "class",
  mode: "silent",
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
      colors: {
        default: "#232323",
        ultralight: "#F8F7F6",
        "light-border": "#EEEEEE",
        "dark-border": "#DDDDDD",

        "tag-blue-bg": "#056CF025",
        "tag-blue": "#056CF0",
      },
      opacity: {
        15: ".15",
      },
      lineHeight: {
        0: "0",
      },
      /*fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },*/
      spacing: {
        22: "5.5rem",
        72: "18rem",
      },
      animation: {
        move: "move 6s linear infinite",
      },
    },
  },
  plugins: {
    link: apply
      `text-blue-500 transition duration-75 ease-in-out hover:text-blue-400`,
  },
};

if (IS_BROWSER) setup(config);
