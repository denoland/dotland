// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { config, setup } from "_twind";
import { RenderContext, RenderFn } from "$fresh/server.ts";
import { virtualSheet } from "twind/sheets";

const sheet = virtualSheet();
sheet.reset();
setup({ sheet, ...config });

export function render(ctx: RenderContext, render: RenderFn) {
  const snapshot = ctx.state.get("twindSnapshot") as unknown[] | null;
  sheet.reset(snapshot || undefined);
  render();
  ctx.styles.splice(0, ctx.styles.length, ...(sheet).target);
  const newSnapshot = sheet.reset();
  ctx.state.set("twindSnapshot", newSnapshot);
}
