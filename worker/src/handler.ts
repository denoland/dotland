/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { handleRegistryRequest } from "./registry";

const REMOTE_URL = "https://deno-website2.now.sh";
const TYPEDOC_REMOTE_URL =
  "http://deno.land.s3-website-us-east-1.amazonaws.com";

export async function handleRequest(request: Request) {
  const accept = request.headers.get("accept");
  const isHtml = accept && accept.indexOf("html") >= 0;

  const url = new URL(request.url);

  if (url.pathname.startsWith("/typedoc")) {
    return proxyFile(url, TYPEDOC_REMOTE_URL, request);
  }

  const isRegistryRequest =
    url.pathname.startsWith("/std") || url.pathname.startsWith("/x");

  if (isRegistryRequest && !isHtml) {
    return handleRegistryRequest(url);
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
