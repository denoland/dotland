/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { handleRegistryRequest } from "./registry.ts";
import { handleVSCRequest } from "./vscode.ts";

const REMOTE_URL = "https://deno-website2.now.sh";

export function withLog(
  handler: (request: Request) => Promise<Response>,
): (request: Request) => Promise<Response> {
  return async (req) => {
    const start = new Date();
    let res: Response;
    try {
      res = await handler(req);
    } catch (err) {
      console.error(err);
      res = new Response("500 Internal Server Error\nPlease try again later.", {
        status: 500,
      });
    }
    const duration = new Date().getTime() - start.getTime();
    console.log(
      `%c${res.status} %c${duration}ms ${new URL(req.url).pathname}`,
      `color: ${res.status >= 200 && res.status <= 499 ? "green" : "red"}`,
      "color: inherit",
    );
    return res;
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
