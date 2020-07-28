import { parseNameVersion } from "../../util/registry_utils";

const S3_BUCKET =
  "http://deno-registry-prod-storagebucket-d7uq3yal946u.s3-website-us-east-1.amazonaws.com/";

export async function handleRegistryRequest(url: URL): Promise<Response> {
  console.log("registry request", url.pathname);
  const remoteUrl = getRegistrySourceURL(url.pathname);
  if (!remoteUrl) {
    return new Response("Module does not exist: " + url.pathname, {
      status: 404,
      statusText: "Not Found",
      headers: { "content-type": "text/plain" },
    });
  }
  const resp = await fetch(remoteUrl, { cf: { cacheEverything: true } });
  const resp2 = new Response(resp.body, resp);
  resp2.headers.set("Access-Control-Allow-Origin", "*");
  return resp2;
}

export function getRegistrySourceURL(pathname: string): string | undefined {
  if (pathname.startsWith("/std")) {
    return getRegistrySourceURL("/x" + pathname);
  }
  if (!pathname.startsWith("/x/")) {
    return undefined;
  }
  const nameBranchRest = pathname.replace(/^\/x\//, "");
  const [nameBranch, ...rest] = nameBranchRest.split("/");
  const [name, version] = parseNameVersion(nameBranch);
  if (!version) return undefined;
  const path = rest.join("/");
  return `${S3_BUCKET}${name}/versions/${version}/raw/${path}`;
}
