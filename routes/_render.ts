// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { config, setup } from "../deps.ts";
import { RenderContext, RenderFn, virtualSheet } from "../server_deps.ts";

const sheet = virtualSheet();
sheet.reset();
setup({
  sheet,
  ...config,
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
