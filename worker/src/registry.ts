import { parseNameVersion } from "../../util/registry_utils";

const S3_BUCKET =
  "http://deno-registry-prod-storagebucket-d7uq3yal946u.s3-website-us-east-1.amazonaws.com/";

export async function handleRegistryRequest(url: URL): Promise<Response> {
  console.log("registry request", url.pathname);
  const entry = parsePathname(url.pathname);
  if (!entry) {
    return new Response("This module entry is invalid: " + url.pathname, {
      status: 400,
      headers: { "content-type": "text/plain" },
    });
  }
  const { module, version, path } = entry;
  if (!version) {
    const latest = await getLatestVersion(module);
    if (!latest) {
      return new Response(
        "This module has no latest version: " + url.pathname,
        {
          status: 404,
          headers: { "content-type": "text/plain" },
        }
      );
    }
    console.log("registry redirect", module, latest);
    const resp = new Response(undefined, {
      headers: {
        Location: `${module === "std" ? "" : "/x"}/${module}@${latest}/${path}`,
        "x-deno-warning": `Implicitly using latest version (${latest}) for ${
          url.origin
        }${module === "std" ? "" : "/x"}/${module}/${path}`,
      },
      status: 302,
    });
    return resp;
  }
  const remoteUrl = getBackingURL(module, version, path);
  // @ts-ignore
  const resp = await fetch(remoteUrl, { cf: { cacheEverything: true } });
  const resp2 = new Response(resp.body, resp);
  resp2.headers.set("Access-Control-Allow-Origin", "*");
  return resp2;
}

export function parsePathname(
  pathname: string
): { module: string; version: string | undefined; path: string } | undefined {
  if (pathname.startsWith("/std")) {
    return parsePathname("/x" + pathname);
  }
  if (!pathname.startsWith("/x/")) {
    return undefined;
  }
  const nameBranchRest = pathname.replace(/^\/x\//, "");
  const [nameBranch, ...rest] = nameBranchRest.split("/");
  const [name, version] = parseNameVersion(nameBranch);
  const path = rest.join("/");
  return { module: name, version, path };
}

export function getBackingURL(module: string, version: string, path: string) {
  return `${S3_BUCKET}${module}/versions/${version}/raw/${path}`;
}

export async function getLatestVersion(
  module: string
): Promise<string | undefined> {
  const res = await fetch(`${S3_BUCKET}${module}/meta/versions.json`);
  if (!res.ok) return undefined;
  const versions = await res.json();
  return versions?.latest;
}
