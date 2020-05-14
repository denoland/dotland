import { parseNameVersion, findEntry } from "../../util/registry_utils";

export async function handleRegistryRequest(url: URL): Promise<Response> {
  console.log("registry request", url.pathname);
  const remoteUrl = getRegistrySourceURL(url.pathname);
  if (!remoteUrl) {
    return new Response("Not in database.json: " + url.pathname, {
      status: 404,
      statusText: "Not Found",
      headers: { "content-type": "text/plain" },
    });
  }

  let response = await fetch(remoteUrl);
  response = new Response(response.body, response);
  if (needsWarning(url.pathname)) {
    response.headers.set(
      "X-Deno-Warning",
      `Implicitly using master branch ${url}`
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

export function needsWarning(pathname: string): boolean {
  return pathname.startsWith("/std") && !pathname.startsWith("/std@");
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
  const path = rest.join("/");
  const entry = findEntry(name);
  return entry?.getSourceURL("/" + path, version);
}
