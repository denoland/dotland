import { proxy } from "../src/util/registry_utils";

const REMOTE_URL = "https://deno-website2-v1.now.sh";
const S3_REMOTE_URL = "http://deno.land.s3-website-us-east-1.amazonaws.com";

addEventListener("fetch", event => {
  console.log("proxy", proxy);
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
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

function redirect(url, remoteUrl, request) {
  const init = {
    method: request.method,
    headers: request.headers
  };
  const urlR = remoteUrl + url.pathname;
  console.log(`Proxy ${url} to ${urlR}`);
  const modifiedRequest = new Request(urlR, init);
  return fetch(modifiedRequest);
}
