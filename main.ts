#!/usr/bin/env -S deno run --allow-read --allow-net --allow-env --allow-run --allow-hrtime --no-check --watch

// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import {
  accepts,
  ConnInfo,
  createReporter,
  Reporter,
  router,
  serve,
  ServerContext,
} from "./server_deps.ts";

import manifest from "./fresh.gen.ts";

import { routes as completionsV2Routes } from "./completions_v2.ts";

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
  handler: (request: Request) => Response | Promise<Response>,
): (request: Request, connInfo: ConnInfo) => Promise<Response> {
  return async (req, con) => {
    let err: unknown;
    let res!: Response;
    const start = performance.now();
    try {
      res = await handler(req);
    } catch (e) {
      err = e;
      console.error(err);
      res = new Response(
        "500 Internal Server Error\nPlease try again later.",
        { status: 500 },
      );
    } finally {
      await ga(req, con, res, start, err);
    }
    return res;
  };
}

const ctx = await ServerContext.fromManifest(manifest);
console.log("Server listening on http://localhost:8000");
serve((req, conn) => {
  return router(
    completionsV2Routes,
    (req) => withLog(ctx.handler())(req, conn),
    // TODO: add 500 handler
  )(req);
});
