/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { parseNameVersion } from "../util/registry_utils.ts";

export const S3_BUCKET =
  "http://deno-registry2-prod-storagebucket-b3a31d16.s3-website-us-east-1.amazonaws.com/";

export async function handleRegistryRequest(url: URL): Promise<Response> {
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
    return new Response(undefined, {
      headers: {
        Location: `${module === "std" ? "" : "/x"}/${module}@${latest}/${path}`,
        "x-deno-warning": `Implicitly using latest version (${latest}) for ${
          url.origin
        }${module === "std" ? "" : "/x"}/${module}/${path}`,
      },
      status: 302,
    });
  }
  if (version.startsWith("v0.") && module === "std") {
    const correctVersion = version.substring(1);
    const versionNumber = parseFloat(correctVersion);
    // For now only block std versions >= 0.43.0
    // Timeline for deprecation:
    // Oct 14 2020: >= 0.70.0
    // Oct 21 2020: >= 0.68.0
    // Oct 28 2020: >= 0.65.0
    // Nov 04 2020: >= 0.61.0
    // Nov 11 2020: >= 0.56.0
    // Nov 18 2020: >= 0.50.0
    // Nov 25 2020: >= 0.43.0
    // Dec 02 2020: >= 0.34.0 (oldest available std release)
    if (versionNumber >= 0.43) {
      return new Response("404 Not Found", {
        headers: {
          "x-deno-warning": `std versions prefixed with 'v' were deprecated recently. Please change your import to ${
            url.origin
          }${
            module === "std" ? "" : "/x"
          }/${module}@${correctVersion}/${path} (at ${url.origin}${
            module === "std" ? "" : "/x"
          }/${module}@${version}/${path})`,
        },
        status: 404,
      });
    }
    return new Response(undefined, {
      headers: {
        Location: `/std@${correctVersion}/${path}`,
        "x-deno-warning": `std versions prefixed with 'v' will be deprecated soon. Please change your import to ${
          url.origin
        }${
          module === "std" ? "" : "/x"
        }/${module}@${correctVersion}/${path} (at ${url.origin}${
          module === "std" ? "" : "/x"
        }/${module}@${version}/${path})`,
      },
      status: 302,
    });
  }
  const remoteUrl = getBackingURL(module, version, path);
  const resp2 = await fetchSource(remoteUrl);

  // JSX and TSX content type fix
  if (
    remoteUrl.endsWith(".jsx") &&
    !resp2.headers.get("content-type")?.includes("javascript")
  ) {
    resp2.headers.set("content-type", "application/javascript");
  } else if (
    remoteUrl.endsWith(".tsx") &&
    !resp2.headers.get("content-type")?.includes("typescript")
  ) {
    resp2.headers.set("content-type", "application/typescript");
  }

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

export async function fetchSource(remoteUrl: string) {
  let lastErr;
  for (let i = 0; i < 3; i++) {
    try {
      const resp = await fetch(remoteUrl);
      if (resp.status === 403 || resp.status === 404) {
        return new Response("404 Not Found", { status: 404 });
      }
      if (!resp.ok) throw new TypeError("non 2xx status code returned");
      return new Response(resp.body, {
        headers: resp.headers,
        status: resp.status,
      });
    } catch (err) {
      // TODO(lucacasonato): only retry on known retryable errors
      console.warn("retrying on proxy error", err);
      lastErr = err;
    }
  }
  throw lastErr;
}

export async function getLatestVersion(
  module: string
): Promise<string | undefined> {
  let lastErr;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(`${S3_BUCKET}${module}/meta/versions.json`);
      if (res.status === 404 || res.status === 403) return undefined;
      if (!res.ok) throw new TypeError("non 2xx status code returned");
      const versions = await res.json();
      return versions?.latest;
    } catch (err) {
      // TODO(lucacasonato): only retry on known retryable errors
      console.warn("retrying on proxy error", err);
      lastErr = err;
    }
  }
  throw lastErr;
}
