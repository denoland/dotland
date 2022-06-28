import { IS_BROWSER } from "$fresh/runtime.ts";
import { apply, Configuration, cssomSheet, setup, Sheet } from "twind";
export * from "twind";
import { css } from "twind/css";
export { css };

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
      colors: {
        main: "#333333",
        light: "#999999",
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
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        18: "4.5rem",
        22: "5.5rem",
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
    "form-select-bg": css({
      "background-image":
        `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%239fa6b2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e")`,
      "background-position": "right .5rem center",
      "background-size": "1.5em 1.5em",
      "background-repeat": "no-repeat",
    }),
  },
};

if (IS_BROWSER) {
  const el = document.getElementById("__FRSH_STYLE") as HTMLStyleElement;
  const rules = el.innerText.split("\n");
  const mappings = JSON.parse(rules.pop()!.slice(2, -2));
  const precedences = JSON.parse(rules.pop()!.slice(2, -2));
  const state = [precedences, new Set(rules), new Map(mappings), true];
  const sheet: Sheet = {
    ...cssomSheet({ target: el.sheet! }),
    init(cb) {
      return cb(state.shift());
    },
  };
  config.sheet = sheet;
  setup(config);
}
