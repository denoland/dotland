import { IS_BROWSER } from "$fresh/runtime.ts";
import { apply, Configuration, setup, tw } from "twind";
export { css } from "twind/css";

export { apply, setup, tw };
export const config: Configuration = {
  darkMode: "class",
  mode: "silent",
  theme: {
    fontFamily: {
      sans: [
        "Inter",
      ],
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
      opacity: {
        15: ".15",
      },
      lineHeight: {
        0: "0",
      },
      colors: {
        main: "#333333",
        secondary: "#EEEEEE",
        light: "#999999",
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        18: "4.5rem",
        72: "18rem",
        76: "19rem",
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
