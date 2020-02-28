import { proxy } from "../../web/src/util/registry_utils";

// const REMOTE_URL = "https://deno.land";
const REMOTE_URL = "https://denoland.netlify.com";
const S3_REMOTE_URL = "http://deno.land.s3-website-us-east-1.amazonaws.com";

export async function handleRequest(request: Request) {
  const accept = request.headers.get("accept");
  // console.log("accept header", accept);
  const isHtml = accept && accept.indexOf("html") >= 0;

  const url = new URL(request.url);
  // console.log('request.url', url.pathname);
  const maybeProxyElsewhere =
    url.pathname.startsWith("/std") || url.pathname.startsWith("/x");

  // TODO(ry) Support docs without hitting S3...
  if (url.pathname.startsWith("/typedoc")) {
    return redirect(url, S3_REMOTE_URL, request);
  }

  if (isHtml) {
    return redirect(url, REMOTE_URL, request);
  }

  if (!maybeProxyElsewhere) {
    return redirect(url, REMOTE_URL, request);
  }

  console.log("serve up text", url.pathname);
  const proxied = proxy(url.pathname);
  if (!proxied) {
    return new Response("Not in database.json " + url.pathname, {
      status: 404,
      statusText: "Not Found",
      headers: { "content-type": "text/plain" }
    });
  }
  const { entry, path } = proxied;
  const rUrl = `${entry.url}${path}`;
  console.log("text proxy", rUrl);
  return fetch(rUrl);
}

function redirect(url: URL, remoteUrl: string, request: Request) {
  const init = {
    method: request.method,
    headers: request.headers
  };
  const urlR = remoteUrl + url.pathname;
  console.log(`Proxy ${url} to ${urlR}`);
  const modifiedRequest = new Request(urlR, init);
  console.log("modifiedRequest", modifiedRequest.url);
  return fetch(modifiedRequest);
}
