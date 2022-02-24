// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { ServerContext } from "./server_deps.ts";
import routes from "./routes.gen.ts";

import { accepts, createReporter, serve } from "./server_deps.ts";
import { ConnInfo } from "https://deno.land/std@0.112.0/http/server.ts";

const ga = createReporter({
  filter(req, res) {
    const { pathname } = new URL(req.url);
    const isHtml = accepts(req, "application/*", "text/html") === "text/html";
    return pathname === "/" || pathname.startsWith("/std") ||
      pathname.startsWith("/x") || isHtml || res.status >= 400;
  },
  metaData(req, res) {
    const accept = req.headers.get("accept");
    const referer = req.headers.get("referer");
    const userAgent = req.headers.get("user-agent");

    const { ok, statusText } = res;
    const isHtml = accepts(req, "application/*", "text/html") === "text/html";

    // Set the page title to "website" or "javascript" or "typescript" or "wasm"
    const contentType = res.headers.get("content-type");
    let documentTitle;
    if (!ok) {
      documentTitle = statusText.toLowerCase();
    } else if (isHtml) {
      documentTitle = "website";
    } else if (contentType != null) {
      documentTitle = /^application\/(.*?)(?:;|$)/i.exec(contentType)?.[1];
    }

    // Files downloaded by a bot (deno, curl) get a special medium/source tag.
    let campaignMedium;
    let campaignSource;
    if (
      referer == null &&
      (userAgent == null || !userAgent.startsWith("Mozilla/")) &&
      (accept == null || accept === "*/*")
    ) {
      campaignMedium = "Bot";
      campaignSource = userAgent?.replace(/[^\w\-].*$/, "");
    }

    return { campaignMedium, campaignSource, documentTitle };
  },
});

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

const ctx = await ServerContext.fromRoutes(routes);
console.log("Server listening on http://localhost:8000");
serve(withLog(ctx.handler()));
