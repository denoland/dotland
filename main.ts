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
import { lookupSymbol } from "./util/doc_utils.ts";
import { withLog } from "./util/ga_utils.ts";
import { setup } from "$doc_components/services.ts";

import manifest from "./fresh.gen.ts";
import options from "./options.ts";

import { routes as completionsV2Routes } from "./completions_v2.ts";

await setup({
  resolveHref(current: URL, symbol?: string, property?: string) {
    const url = new URL(current);
    if (symbol) {
      url.searchParams.set("s", symbol);
    } else {
      url.searchParams.delete("s");
    }
    if (property) {
      url.searchParams.set("p", property);
    } else {
      url.searchParams.delete("p");
    }
    return url.href;
  },
  lookupHref(
    current: URL,
    namespace: string | undefined,
    symbol: string,
  ): string | undefined {
    return lookupSymbol(current, namespace, symbol);
  },
  resolveSourceHref(url, line) {
    if (!url.startsWith("https://deno.land")) {
      return url;
    }
    return line ? `${url}?source#L${line}` : `${url}?source`;
  },
  runtime: { Fragment, h },
});

const ctx = await ServerContext.fromManifest(manifest, options);

const innerHandler = withLog(ctx.handler());
const handler = router(completionsV2Routes, innerHandler);

serve(handler);
