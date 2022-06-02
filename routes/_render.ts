// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { apply, setup, virtualSheet } from "../deps.ts";
import { RenderContext, RenderFn } from "../server_deps.ts";

const sheet = virtualSheet();
sheet.reset();
setup({
  sheet,
  mode: "silent",
  theme: {
    colors: {
      transparent: "transparent",
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
});

/*  tw`
  text-green-500 text-red-400 mb-2
  border-green-300
  hover:border-green-300
  focus:border-green-300
  border-red-300
  hover:border-red-300
  focus:border-red-300`;*/

export function render(ctx: RenderContext, render: RenderFn) {
  const snapshot = ctx.state.get("twindSnapshot") as unknown[] | null;
  sheet.reset(snapshot || undefined);
  render();
  ctx.styles.splice(0, ctx.styles.length, ...(sheet).target);
  const newSnapshot = sheet.reset();
  ctx.state.set("twindSnapshot", newSnapshot);
}
