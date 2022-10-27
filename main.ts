// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { ServerContext } from "$fresh/server.ts";
import { serve } from "$std/http/server.ts";
import { lookupSymbol } from "./util/doc_utils.ts";
import { withLog } from "./util/ga_utils.ts";
import { setup } from "$doc_components/services.ts";

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

import manifest from "./fresh.gen.ts";

await setup({
  resolveHref(current: URL, symbol?: string) {
    const url = new URL(current);
    if (symbol) {
      url.searchParams.set("s", symbol);
    } else {
      url.searchParams.delete("s");
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
});

const ctx = await ServerContext.fromManifest(manifest, {
  plugins: [twindPlugin(twindConfig)],
});

const handler = withLog(ctx.handler());

serve(handler);
