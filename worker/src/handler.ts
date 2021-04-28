/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { handleRegistryRequest } from "./registry";
import { handleVSCRequest } from "./vscode";

const REMOTE_URL = "https://deno-website2.now.sh";

export async function handleRequest(request: Request) {
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
      307
    );
  }

  if (url.pathname.startsWith("/typedoc")) {
    return Response.redirect("https://doc.deno.land/builtin/stable", 301);
  }

  if (url.pathname.startsWith("/_vsc")) {
    return handleVSCRequest(url);
  }

  const isRegistryRequest =
    url.pathname.startsWith("/std") || url.pathname.startsWith("/x/");

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
  url: string
): { rest: string; line: number } | null {
  const matches = ALT_LINENUMBER_MATCHER.exec(url);
  if (matches === null) return null;
  return {
    rest: matches[1],
    line: parseInt(matches[2]),
  };
}

function proxyFile(url: URL, remoteUrl: string, request: Request) {
  const init = {
    method: request.method,
    headers: request.headers,
  };
  const urlR = remoteUrl + url.pathname;
  console.log(`Proxy ${url} to ${urlR}`);
  const modifiedRequest = new Request(urlR, init);
  console.log("modifiedRequest", modifiedRequest.url);
  return fetch(modifiedRequest);
}
