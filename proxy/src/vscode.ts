import { Context, RouterContext } from "../deps.ts";
import { S3_BUCKET } from "./registry.ts";
import { cachedFetch, State } from "./utils.ts";

export async function vscModule(ctx: RouterContext<{ module: string }, State>) {
  const module = ctx.params.module;
  const resp = await cachedFetch(
    ctx,
    `${S3_BUCKET}${module}/meta/versions.json`,
  );
  if (resp.status === 403 || resp.status === 404) {
    resp.body?.cancel();
    ctx.response.status = 404;
    ctx.response.body = "module not found";
    return;
  }
  if (!resp.ok) {
    resp.body?.cancel();
    ctx.response.status = 500;
    ctx.response.body = "internal server error 1";
    return;
  }
  const json = await resp.json();
  ctx.response.status = 200;
  ctx.response.body = JSON.stringify(json.versions);
  ctx.response.type = "application/json";
  ctx.response.headers.set("cache-control", "max-age=86400");
}

export async function vscPaths(
  ctx: RouterContext<{ module: string; version: string }, State>,
) {
  await getPaths(ctx, ctx.params.module, ctx.params.version);
}

export async function vscPathsLatest(
  ctx: RouterContext<{ module: string }, State>,
) {
  const module = ctx.params.module;
  const resp = await cachedFetch(
    ctx,
    `${S3_BUCKET}${module}/meta/versions.json`,
  );
  if (resp.status === 403 || resp.status === 404) {
    resp.body?.cancel();
    ctx.response.status = 404;
    ctx.response.body = "module or version not found";
    return;
  }
  if (!resp.ok) {
    resp.body?.cancel();
    ctx.response.status = 500;
    ctx.response.body = "internal server error 3";
    return;
  }
  const json = await resp.json();
  if (!json.latest) {
    resp.body?.cancel();
    ctx.response.status = 404;
    ctx.response.body = "module has no latest version";
    return;
  }
  await getPaths(ctx, ctx.params.module!, json.latest);
}

async function getPaths(
  ctx: Context<State>,
  module: string,
  version: string,
) {
  const resp = await cachedFetch(
    ctx,
    `${S3_BUCKET}${module}/versions/${version}/meta/meta.json`,
  );
  if (resp.status === 403 || resp.status === 404) {
    resp.body?.cancel();
    ctx.response.status = 404;
    ctx.response.body = "module or version not found";
    return;
  }
  if (!resp.ok) {
    resp.body?.cancel();
    ctx.response.status = 500;
    ctx.response.body = "internal server error 2";
    return;
  }
  const json = await resp.json();
  const list = (json.directory_listing as Array<Record<string, string>>)
    .filter((f) => f.type === "file" && !f.path.includes("/_"))
    .map((f) => f.path.substring(1))
    .filter(
      (f) =>
        f.endsWith(".jsx") ||
        f.endsWith(".jsx") ||
        f.endsWith(".ts") ||
        f.endsWith(".tsx") ||
        f.endsWith(".mjs"),
    );
  ctx.response.status = 200;
  ctx.response.body = JSON.stringify(list);
  ctx.response.type = "application/json";
  ctx.response.headers.set("cache-control", "max-age=86400");
}
