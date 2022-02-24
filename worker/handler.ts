/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { handleRegistryRequest } from "./registry.ts";
import { handleConfigRequest } from "./registry_config.ts";
import { handleApiRequest } from "./suggestions.ts";
import { handleVSCRequest } from "./vscode.ts";

import type { ConnInfo } from "https://deno.land/std@0.112.0/http/server.ts";
import { createReporter } from "https://deno.land/x/g_a@0.1.2/mod.ts";
import { accepts } from "https://deno.land/x/oak_commons@0.1.1/negotiation.ts";

const REMOTE_URL = "https://dotland-fresh.deno.dev";

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
  handler: (
    request: Request,
    connInfo: ConnInfo,
  ) => Response | Promise<Response>,
): (request: Request, connInfo: ConnInfo) => Promise<Response> {
  return async (req, con) => {
    let err: unknown;
    let res!: Response;
    const start = performance.now();
    try {
      res = await handler(req, con);
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

export function handleRequest(request: Request): Promise<Response> {
  // this checks to see if the requestor prefers "application" code over "html"
  // which would be run-time clients who either omit an accept header (which
  // implies any content type) or provides a `*/*` header
  const isHtml = accepts(request, "application/*", "text/html") === "text/html";

  const url = new URL(request.url);

  if (url.pathname === "/v1") {
    return Promise.resolve(
      Response.redirect("https://deno.land/posts/v1", 301),
    );
  }

  if (url.pathname === "/posts") {
    return Promise.resolve(Response.redirect("https://deno.com/blog", 307));
  }

  if (url.pathname.startsWith("/posts/")) {
    return Promise.resolve(Response.redirect(
      `https://deno.com/blog/${url.pathname.substring("/posts/".length)}`,
      307,
    ));
  }

  if (url.pathname.startsWith("/typedoc")) {
    return Promise.resolve(
      Response.redirect("https://doc.deno.land/deno/stable", 301),
    );
  }

  if (url.pathname.startsWith("/_vsc")) {
    return handleVSCRequest(url);
  }

  if (url.pathname.startsWith("/_api/")) {
    return handleApiRequest(url);
  }

  if (["/install.sh", "/install.ps1"].includes(url.pathname)) {
    return Promise.resolve(
      Response.redirect(`https://deno.land/x/install${url.pathname}`, 307),
    );
  }

  if (url.pathname === "/.well-known/deno-import-intellisense.json") {
    return handleConfigRequest(request);
  }

  const isRegistryRequest = url.pathname.startsWith("/std") ||
    url.pathname.startsWith("/x/");

  if (isRegistryRequest) {
    if (isHtml) {
      const ln = extractAltLineNumberReference(url.toString());
      if (ln) {
        return Promise.resolve(
          Response.redirect(`${ln.rest}#L${ln.line}`, 302),
        );
      }
    } else {
      return handleRegistryRequest(url);
    }
  }

  if (!["HEAD", "GET"].includes(request.method)) {
    return Promise.resolve(new Response(null, { status: 405 })); // Method not allowed.
  }

  return proxyFile(url, REMOTE_URL, request);
}

const ALT_LINENUMBER_MATCHER = /(.*):(\d+):\d+$/;

export function extractAltLineNumberReference(
  url: string,
): { rest: string; line: number } | null {
  const matches = ALT_LINENUMBER_MATCHER.exec(url);
  if (matches === null) return null;
  return {
    rest: matches[1],
    line: parseInt(matches[2]),
  };
}

interface CacheEntry {
  body: ArrayBuffer;
  contentType: string;
  etag: string;
  immutable: boolean;
}

const cache = new Map<string, CacheEntry>();

// When deploying a new version, the worker will be updated before the static
// website hosted by Vercel gets updated. Therefore we clear the cache 2 minutes
// after startup up to ensure that there is no stale static content in the
// in-memory cache.
setTimeout(() => cache.clear(), 2 * 60 * 1000);

async function proxyFile(
  url: URL,
  remoteUrl: string,
  request: Request,
): Promise<Response> {
  const proxyUrl = new URL(remoteUrl + url.pathname).href;
  let cacheEntry = cache.get(proxyUrl);

  if (cacheEntry === undefined) {
    const proxyRequest = new Request(proxyUrl);
    const proxyResponse = await fetchWithRetry(proxyRequest);

    if (!(proxyResponse.ok || proxyResponse.redirected)) {
      return proxyResponse;
    }

    const body = await proxyResponse.arrayBuffer();
    const contentType = proxyResponse.headers.get("content-type") ??
      "application/binary";
    const etag = await crypto.subtle.digest("SHA-1", body).then((hash) =>
      Array.from(new Uint8Array(hash))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
    );
    const immutable = /\bimmutable\b/i
      .test(proxyResponse.headers.get("cache-control") ?? "");

    cacheEntry = {
      body,
      contentType,
      etag,
      immutable,
    };
    cache.set(proxyUrl, cacheEntry);
  }

  if (request.headers.get("if-none-match") !== cacheEntry.etag) {
    let body;
    switch (request.method) {
      case "HEAD":
        body = null;
        break;
      case "GET":
        body = cacheEntry.body;
        break;
      default:
        throw new Error(`Unsupported request method: ${request.method}`);
    }
    return new Response(body, {
      headers: {
        "content-type": cacheEntry.contentType,
        "cache-control": cacheEntry.immutable
          ? "public,max-age=31536000,immutable"
          : "public,max-age=0,must-revalidate",
        "etag": cacheEntry.etag,
      },
    });
  } else {
    return new Response(null, { status: 304 }); // Not modified.
  }
}

async function fetchWithRetry(request: Request): Promise<Response> {
  let promise: Promise<Response>;
  for (let i = 0; i < 3; i++) {
    promise = fetch(request);
    try {
      return await promise;
    } catch (err) {
      // TODO(lucacasonato): only retry on known retryable errors
      console.warn("retrying on proxy error", err);
    }
  }
  return promise!;
}
