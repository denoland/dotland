#!/usr/bin/env -S deno run --allow-read --allow-net --allow-env --allow-run --allow-hrtime --no-check --watch

// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import {
  InnerRenderFunction,
  RenderContext,
  ServerContext,
} from "$fresh/server.ts";
import { Fragment, h } from "preact";
import { serve } from "$std/http/server.ts";
import { router } from "$router";
import { withLog } from "./util/ga_utils.ts";
import { setup as dcSetup } from "$doc_components/services.ts";
import { virtualSheet } from "twind/sheets";
import { config, setup } from "@twind";

import manifest from "./fresh.gen.ts";

import { routes as completionsV2Routes } from "./completions_v2.ts";

const docland = "https://doc.deno.land/";
await dcSetup({
  resolveHref(current, symbol) {
    // FIXME(bartlomieju): special casing for std here is not ideal
    if (symbol && current.startsWith("/std")) {
      current = `https://deno.land${current}`;
    }
    return symbol ? `${docland}${current}/~/${symbol}` : current;
  },
  lookupHref(
    current: string,
    namespace: string | undefined,
    symbol: string,
  ): string | undefined {
    // FIXME(bartlomieju): special casing for std here is not ideal
    if (current.startsWith("/std")) {
      current = `https://deno.land${current}`;
    }
    return namespace
      ? `${docland}${current}/~/${namespace}.${symbol}`
      : `${docland}${current}/~/${symbol}`;
  },
  runtime: { Fragment, h },
});

const sheet = virtualSheet();
sheet.reset();
setup({ ...config, sheet });

function render(ctx: RenderContext, render: InnerRenderFunction) {
  const snapshot = ctx.state.get("twind") as unknown[] | null;
  sheet.reset(snapshot || undefined);
  render();
  ctx.styles.splice(0, ctx.styles.length, ...(sheet).target);
  const newSnapshot = sheet.reset();
  ctx.state.set("twind", newSnapshot);
}

const ctx = await ServerContext.fromManifest(manifest, { render });

const innerHandler = withLog(ctx.handler());
const handler = router(completionsV2Routes, innerHandler);

serve(handler);
