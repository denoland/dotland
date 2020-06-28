/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { handleRegistryRequest } from "./registry";

const REMOTE_URL = "https://deno-website2.lucacasonato.vercel.app";

export async function handleRequest(event: FetchEvent) {
  const request = event.request;
  const accept = request.headers.get("accept");
  const isHtml = accept && accept.indexOf("html") >= 0;

  const url = new URL(request.url);

  const isRegistryRequest = url.pathname.startsWith("/std") ||
    url.pathname.startsWith("/x");

  if (isRegistryRequest && !isHtml) {
    const cache = caches.default;
    let response = await cache.match(request);
    if (!response) {
      response = await handleRegistryRequest(url);
      event.waitUntil(cache.put(request, response));
    }
    return response;
  }

  return proxyFile(url, REMOTE_URL, request);
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
