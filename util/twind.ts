import { IS_BROWSER } from "$fresh/runtime.ts";
import { apply, Configuration, cssomSheet, setup, Sheet } from "twind";
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
