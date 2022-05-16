import { IS_BROWSER } from "https://raw.githubusercontent.com/lucacasonato/fresh/ec388f87fb19cf5c247ad62c9a0beb771170da07/runtime.ts";
export * from "https://raw.githubusercontent.com/lucacasonato/fresh/ec388f87fb19cf5c247ad62c9a0beb771170da07/runtime.ts";

import {
  apply,
  Configuration,
  setup,
  theme,
  tw,
} from "https://esm.sh/twind@0.16.16?pin=v76";
export { apply, setup, theme, tw };
export { css } from "https://esm.sh/twind@0.16.16/css?pin=v76";

export const config: Configuration = {
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
      lineHeight: {
        0: "0",
      },
      /*fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },*/
      width: {
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
  setup(config);
}
