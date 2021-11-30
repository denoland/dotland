/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { handleRegistryRequest } from "./registry.ts";
import { handleVSCRequest } from "./vscode.ts";
import { reportAnalytics } from "./analytics.ts";
import { ConnInfo } from "https://deno.land/std@0.112.0/http/server.ts";

<<<<<<< HEAD
const REMOTE_URL = "https://deno-cn.vercel.app";
=======
const REMOTE_URL = "https://cf-proxy.deno.land";
>>>>>>> 7c6ba8be2326cd4bd17db08fb856c8d252a2aad7

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
      const srt = performance.now() - start;
      reportAnalytics(req, con, res, srt, err).catch((e) =>
        console.error("reportAnalytics() failed:", e)
      );
      return res;
    }
  };
}

export function handleRequest(request: Request) {
  const accept = request.headers.get("accept");
  const isHtml = accept && accept.indexOf("html") >= 0;

  const url = new URL(request.url);

  if (url.pathname === "/v1") {
    return Response.redirect("https://deno.land/posts/v1", 301);
  }

  if (url.pathname === "/posts") {
    return Response.redirect("https://deno.com/blog", 307);
  }

  if (url.pathname.startsWith("/posts/")) {
    return Response.redirect(
      `https://deno.com/blog/${url.pathname.substring("/posts/".length)}`,
      307,
    );
  }

  if (url.pathname.startsWith("/typedoc")) {
    return Response.redirect("https://doc.deno.land/builtin/stable", 301);
  }

  if (url.pathname.startsWith("/_vsc")) {
    return handleVSCRequest(url);
  }

  const isRegistryRequest = url.pathname.startsWith("/std") ||
    url.pathname.startsWith("/x/");

  if (isRegistryRequest) {
    if (isHtml) {
      const ln = extractAltLineNumberReference(url.toString());
      if (ln) {
        return Response.redirect(ln.rest + "#L" + ln.line, 302);
      }
    } else {
      return handleRegistryRequest(url);
    }
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

async function proxyFile(
  url: URL,
  remoteUrl: string,
  request: Request,
): Promise<Response> {
  const init = {
    method: request.method,
    headers: request.headers,
  };
  const urlR = remoteUrl + url.pathname;
  const modifiedRequest = new Request(urlR, init);
  let lastErr;
  for (let i = 0; i < 3; i++) {
    try {
      return await fetch(modifiedRequest);
    } catch (err) {
      // TODO(lucacasonato): only retry on known retryable errors
      console.warn("retrying on proxy error", err);
      lastErr = err;
    }
  }
  throw lastErr;
}
