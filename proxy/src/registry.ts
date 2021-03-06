import { Context, readerFromStreamReader, RouterContext } from "../deps.ts";
import { cachedFetch, State } from "./utils.ts";

export const S3_BUCKET =
  "http://deno-registry2-prod-storagebucket-b3a31d16.s3-website-us-east-1.amazonaws.com/";
const PROXY_HEADERS = [
  "date",
  "cache-control",
  "last-modified",
  "etag",
  "x-deno-cache",
];

export async function registryMiddleware(
  ctx: RouterContext<{
    module?: string;
    version: string | undefined;
    path: string;
  }, State>,
) {
  const accepts = ctx.request.accepts();
  const acceptsHtml = accepts?.includes("text/html");
  if (acceptsHtml) {
    const ln = extractAltLineNumberReference(ctx.request.url.pathname);
    if (ln) {
      ctx.response.redirect(`${ln.rest}#L${ln.line}`);
    }
    return;
  }

  const module = ctx.params.module ?? "std";
  const version = ctx.params.version;
  const path = ctx.params.path;

  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Max-Age", "86400");

  // If no version is specified, redirect to the latest
  if (version === undefined) {
    const latest = await getLatestVersion(ctx, module);
    if (latest !== undefined) {
      ctx.response.headers.set(
        "x-deno-warning",
        `Implicitly using latest version (${latest}) for ${ctx.request.url.origin}${
          module === "std" ? "" : "/x"
        }/${module}/${path}`,
      );
      ctx.response.redirect(
        `${module === "std" ? "" : "/x"}/${module}@${latest}/${path}`,
      );
    } else {
      ctx.response.status = 404;
      ctx.response.body =
        `The requested module (${module}) has no latest version.`;
    }
    return;
  }

  const backingUrl = getBackingURL(module, version, path);

  await proxy(ctx, backingUrl);
}

export function getBackingURL(module: string, version: string, path: string) {
  return `${S3_BUCKET}${module}/versions/${version}/raw/${path}`;
}

export async function getLatestVersion(
  ctx: Context<State>,
  module: string,
): Promise<string | undefined> {
  const res = await cachedFetch(
    ctx,
    `${S3_BUCKET}${module}/meta/versions.json`,
  );
  if (!res.ok) {
    if (res.body) await res.arrayBuffer();
    return undefined;
  }
  const versions = await res.json();
  return versions?.latest;
}

export async function proxy(ctx: Context<State>, url: string) {
  const resp = await cachedFetch(
    ctx,
    url,
  );
  if ([403, 404].includes(resp.status)) {
    await resp.arrayBuffer();
    ctx.response.status = 404;
    ctx.response.body = "Resource Not Found";
    return;
  }

  ctx.response.status = resp.status;
  ctx.response.body = resp.body
    ? readerFromStreamReader(resp.body.getReader())
    : new Uint8Array();
  const contentType = resp.headers.get("content-type");
  if (resp.url.endsWith(".jsx") && !contentType?.includes("javascript")) {
    ctx.response.type = "application/javascript";
  } else if (
    resp.url.endsWith(".tsx") && !contentType?.includes("typescript")
  ) {
    ctx.response.type = "application/typescript";
  } else if (contentType !== null) {
    ctx.response.type = contentType;
  }
  for (const [name, val] of resp.headers.entries()) {
    if (PROXY_HEADERS.includes(name)) {
      ctx.response.headers.set(name, val);
    }
  }
}

const ALT_LINENUMBER_MATCHER = /(.*):(\d+):\d+$/;

export function extractAltLineNumberReference(
  url: string,
): { rest: string; line: number } | null {
  const matches = ALT_LINENUMBER_MATCHER.exec(url);
  if (matches === null) return null;
  return {
    rest: matches[1],
    line: parseInt(matches[2]),
  };
}
