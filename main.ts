#!/usr/bin/env -S deno run --allow-read --allow-net --allow-env --allow-run --allow-hrtime --no-check --watch

// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { ServerContext } from "$fresh/server.ts";
import { Fragment, h } from "$fresh/runtime.ts";
import { ConnInfo, serve } from "$std/http/server.ts";
import { router } from "$router";
import { createReporter, Reporter } from "$ga";
import { accepts } from "$oak_commons";
import { setup } from "$doc_components/services.ts";

import manifest from "./fresh.gen.ts";

import { routes as completionsV2Routes } from "./completions_v2.ts";

const docland = "https://doc.deno.land/";
await setup({
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

function isHtmlRequest(req: Request) {
  return accepts(req, "application/*", "text/html") === "text/html";
}

function isNonAssetRequest(req: Request, res: Response) {
  const { pathname } = new URL(req.url);
  return pathname === "/" ||
    pathname.startsWith("/std") ||
    pathname.startsWith("/x") || isHtmlRequest(req) || res.status >= 400;
}

function isBot(req: Request) {
  const accept = req.headers.get("accept");
  const referer = req.headers.get("referer");
  const userAgent = req.headers.get("user-agent");
  return referer == null &&
    (userAgent == null || !userAgent.startsWith("Mozilla/")) &&
    (accept == null || accept === "*/*");
}

function getBotName(req: Request) {
  const userAgent = req.headers.get("user-agent");
  return userAgent?.replace(/[^\w\-].*$/, "");
}

// Makes up a document title based on the returned content type, and whether or
// not an error happened. Example of document titles it can return are "html",
// "javascript", "typescript", "wasm", and "not found".
function getDocumentTitle(req: Request, res: Response) {
  if (!res.ok) {
    return res.statusText.toLowerCase();
  } else if (isHtmlRequest(req)) {
    return "html";
  } else {
    const contentType = res.headers.get("content-type") ?? "";
    return /^application\/(.*?)(?:;|$)/i.exec(contentType)?.[1];
  }
}

const gaForBots = createReporter({
  id: Deno.env.get("GA_TRACKING_ID_FOR_BOTS"),
  filter(req, _res) {
    return isBot(req);
  },
  metaData(req, res) {
    return {
      campaignMedium: "Bot",
      campaignSource: getBotName(req),
      documentTitle: getDocumentTitle(req, res),
    };
  },
});

const gaForHumans = createReporter({
  id: Deno.env.get("GA_TRACKING_ID_FOR_HUMANS"),
  filter(req, res) {
    return !isBot(req) && isNonAssetRequest(req, res);
  },
  metaData(req, res) {
    return { documentTitle: getDocumentTitle(req, res) };
  },
});

const ga: Reporter = async (...args) => {
  await Promise.all([gaForBots(...args), gaForHumans(...args)]);
};

export function withLog(
  handler: (request: Request, conn: ConnInfo) => Response | Promise<Response>,
): (request: Request, connInfo: ConnInfo) => Promise<Response> {
  return async (req, conn) => {
    let err: unknown;
    let res!: Response;
    const start = performance.now();
    try {
      res = await handler(req, conn);
    } catch (e) {
      err = e;
      console.error(err);
      res = new Response(
        "500 Internal Server Error\nPlease try again later.",
        { status: 500 },
      );
    } finally {
      await ga(req, conn, res, start, err);
    }
    return res;
  };
}

const ctx = await ServerContext.fromManifest(manifest);

const innerHandler = withLog(ctx.handler());
const handler = router(completionsV2Routes, innerHandler);

serve(handler);
