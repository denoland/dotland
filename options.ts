// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import {
  FreshOptions,
  InnerRenderFunction,
  RenderContext,
} from "$fresh/server.ts";
import { config, setup } from "@twind";
import { virtualSheet } from "twind/sheets";

const sheet = virtualSheet();
sheet.reset();
setup({ ...config, sheet });

function render(ctx: RenderContext, render: InnerRenderFunction) {
  const snapshot = ctx.state.get("twind") as unknown[] | null;
  sheet.reset(snapshot || undefined);
  render();
  ctx.styles.splice(0, ctx.styles.length, ...(sheet).target);
  const newSnapshot = sheet.reset();
  ctx.styles.push(`/*${JSON.stringify(newSnapshot[1])}*/`);
  ctx.styles.push(
    `/*${
      JSON.stringify([...(newSnapshot[3] as Map<string, string>).entries()])
    }*/`,
  );
  ctx.state.set("twind", newSnapshot);
}

export default { render } as FreshOptions;
