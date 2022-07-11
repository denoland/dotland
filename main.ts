#!/usr/bin/env -S deno run --allow-read --allow-net --allow-env --allow-run --allow-hrtime --no-check --watch

// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { ServerContext } from "$fresh/server.ts";
import { Fragment, h } from "preact";
import { serve } from "$std/http/server.ts";
import { router } from "$router";
import { withLog } from "./util/ga_utils.ts";
import { setup } from "$doc_components/services.ts";

import manifest from "./fresh.gen.ts";
import options from "./options.ts";

import { routes as completionsV2Routes } from "./completions_v2.ts";

await setup({
  resolveHref(current, symbol) {
    // FIXME(bartlomieju): special casing for std here is not ideal
    if (symbol && current.startsWith("/std")) {
      current = `https://deno.land${current}`;
    }
    return symbol ? `${current}?symbol=${symbol}` : current;
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
      ? `${current}?symbol=${namespace}.${symbol}`
      : `${current}?symbol=${symbol}`;
  },
  resolveSourceHref(url, line) {
    return line ? `${url}?code#L${line}` : `${url}?code`;
  },
  runtime: { Fragment, h },
});

const ctx = await ServerContext.fromManifest(manifest, options);

const innerHandler = withLog(ctx.handler());
const handler = router(completionsV2Routes, innerHandler);

serve(handler);
