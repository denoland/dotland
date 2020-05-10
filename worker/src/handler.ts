/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { parseNameVersion, findEntry } from "../../util/registry_utils";

const REMOTE_URL = "https://deno-website2-v1.now.sh";
const S3_REMOTE_URL = "http://deno.land.s3-website-us-east-1.amazonaws.com";

export async function handleRequest(request: Request) {
  const accept = request.headers.get("accept");
  // console.log("accept header", accept);
  const isHtml = accept && accept.indexOf("html") >= 0;

  const url = new URL(request.url);
  // console.log('request.url', url.pathname);

  // TODO(ry) Support docs without hitting S3...
  if (url.pathname.startsWith("/typedoc")) {
    return redirect(url, S3_REMOTE_URL, request);
  }

  if (isHtml) {
    return redirect(url, REMOTE_URL, request);
  }

  const maybeProxyElsewhere =
    url.pathname.startsWith("/std") || url.pathname.startsWith("/x");
  if (!maybeProxyElsewhere) {
    return redirect(url, REMOTE_URL, request);
  }

  console.log("serve up text", url.pathname);
  const remoteUrl = proxy(url.pathname);
  if (!remoteUrl) {
    return new Response("Not in database.json " + url.pathname, {
      status: 404,
      statusText: "Not Found",
      headers: { "content-type": "text/plain" },
    });
  }

  console.log("text proxy", remoteUrl);
  let response = await fetch(remoteUrl);
  if (needsWarning(url.pathname)) {
    response = new Response(response.body, response);
    response.headers.set(
      "X-Deno-Warning",
      `Implicitly using master branch ${url}`
    );
  }
  return response;
}

export function needsWarning(pathname: string): boolean {
  return pathname.startsWith("/std") && !pathname.startsWith("/std@");
}

function redirect(url: URL, remoteUrl: string, request: Request) {
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

export function proxy(pathname: string): string | undefined {
  if (pathname.startsWith("/std")) {
    return proxy("/x" + pathname);
  }
  if (!pathname.startsWith("/x/")) {
    return undefined;
  }
  const nameBranchRest = pathname.replace(/^\/x\//, "");
  const [nameBranch, ...rest] = nameBranchRest.split("/");
  const [name, version] = parseNameVersion(nameBranch);
  const path = rest.join("/");
  const entry = findEntry(name);
  return entry?.getSourceURL("/" + path, version);
}
