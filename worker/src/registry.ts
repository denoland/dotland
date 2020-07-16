import {
  parseNameVersion,
  findEntry,
  findDatabaseEntry,
} from "../../util/registry_utils";

export async function handleRegistryRequest(url: URL): Promise<Response> {
  console.log("registry request", url.pathname);
  const entry = getRegistrySourceURL(url.pathname);
  if (!entry) {
    return new Response("Not in database.json: " + url.pathname, {
      status: 404,
      statusText: "Not Found",
      headers: { "content-type": "text/plain" },
    });
  }

  let response = await fetch(entry.url);
  response = new Response(response.body, response);
  if (needsMasterBranchWarning(entry)) {
    response.headers.set(
      "X-Deno-Warning",
      `Implicitly using master branch ${url}`
    );
  } else if (needsGHDeprecationWarning(entry)) {
    response.headers.set(
      "X-Deno-Warning",
      `The https://deno.land/x/gh:owner:repo redirects are deprecated will be removed on August 1st 2020. Import ${entry.url} instead of ${url}`
    );
  } else if (needsNPMDeprecationWarning(entry)) {
    response.headers.set(
      "X-Deno-Warning",
      `The https://deno.land/x/npm:project redirects are deprecated will be removed on August 1st 2020. Import ${entry.url} instead of ${url}`
    );
  } else if (needsNPMTypeDeprecationWarning(entry)) {
    response.headers.set(
      "X-Deno-Warning",
      `NPM backed deno.land/x entries like ${entry.name} are deprecated will be removed on August 1st 2020. Import ${entry.url} instead of ${url}`
    );
  }
  const originContentType = response.headers.get("content-type");
  if (
    response.ok &&
    (!originContentType || originContentType?.includes("text/plain"))
  ) {
    const charset = originContentType?.includes("charset=utf-8")
      ? "; charset=utf-8"
      : "";
    if (url.pathname.endsWith(".js")) {
      response.headers.set("content-type", `application/javascript${charset}`);
    } else if (url.pathname.endsWith(".ts")) {
      response.headers.set("content-type", `application/typescript${charset}`);
    }
  }

  response.headers.set("Access-Control-Allow-Origin", "*");

  return response;
}

export function needsMasterBranchWarning(entry: Entry): boolean {
  return entry.name === "std" && entry.version === undefined;
}

export function needsGHDeprecationWarning(entry: Entry): boolean {
  return entry.name.startsWith("gh:");
}

export function needsNPMDeprecationWarning(entry: Entry): boolean {
  return entry.name.startsWith("npm:");
}

export function needsNPMTypeDeprecationWarning(entry: Entry): boolean {
  const e = findDatabaseEntry(entry.name);
  return e?.type === "npm";
}

export interface Entry {
  name: string;
  version: string | undefined;
  url: string;
}

export function getRegistrySourceURL(pathname: string): Entry | undefined {
  if (pathname.startsWith("/std")) {
    return getRegistrySourceURL("/x" + pathname);
  }
  if (!pathname.startsWith("/x/")) {
    return undefined;
  }
  const nameBranchRest = pathname.replace(/^\/x\//, "");
  const [nameBranch, ...rest] = nameBranchRest.split("/");
  const [name, version] = parseNameVersion(nameBranch);
  const path = rest.join("/");
  const entry = findEntry(name);
  if (!entry) return undefined;
  return {
    name,
    version,
    url: entry.getSourceURL("/" + path, version),
  };
}
