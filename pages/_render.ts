// This module adds twind support.

import { create, shim, virtualSheet } from "../deps.ts";
import { RenderContext, RenderFn } from "../server_deps.ts";

const sheet = virtualSheet();
sheet.reset();
const { tw } = create({
  sheet,
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
    }
  }
});

export function render(ctx: RenderContext, render: RenderFn) {
  const snapshot = ctx.state.get("twindSnapshot") as unknown[] | null;
  sheet.reset(snapshot || undefined);
  // @ts-ignoree
  const body: undefined | string = render();
  if (body) {
    shim(body, { tw });
  }
  ctx.styles.splice(0, ctx.styles.length, ...sheet.target);
  const newSnapshot = sheet.reset();
  ctx.state.set("twindSnapshot", newSnapshot);
}
