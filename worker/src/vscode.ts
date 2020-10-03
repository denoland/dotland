/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { match } from "path-to-regexp";
import { S3_BUCKET } from "./registry";

const VERSIONS = match("/_vsc1/modules/:module([a-z0-9_]*)");
const PATHS = match("/_vsc1/modules/:module([a-z0-9_]*)/v/:version");
const PATHS_LATEST = match("/_vsc1/modules/:module([a-z0-9_]*)/v_latest");

/**
 * /_vsc1/modules/:module returns a list of all versions for a module
 *
 * /_vsc1/modules/:module/v/:version returns a list of all code files for a version of module
 *
 * /_vsc1/modules/:module/v_latest returns a list of all code files for the latest version of module
 */
export async function handleVSCRequest(url: URL): Promise<Response> {
  const pathname = url.pathname;

  const versions = VERSIONS(pathname);
  if (versions) {
    const module = (versions.params as Record<string, string>)["module"];
    const resp = await fetch(`${S3_BUCKET}${module}/meta/versions.json`);
    if (resp.status === 403 || resp.status === 404)
      return new Response("module not found", { status: 404 });
    if (!resp.ok)
      return new Response("internal server error 1", { status: 500 });
    const json = await resp.json();
    return new Response(JSON.stringify(json.versions), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "max-age=86400",
      },
    });
  }

  const paths = PATHS(pathname);
  if (paths) {
    const module = (paths.params as Record<string, string>)["module"];
    const version = (paths.params as Record<string, string>)["version"];
    return getPaths(module, version);
  }

  const pathsLatest = PATHS_LATEST(pathname);
  if (pathsLatest) {
    const module = (pathsLatest.params as Record<string, string>)["module"];
    const resp = await fetch(`${S3_BUCKET}${module}/meta/versions.json`);
    if (resp.status === 403 || resp.status === 404)
      return new Response("module not found", { status: 404 });
    if (!resp.ok)
      return new Response("internal server error 3", { status: 500 });
    const json = await resp.json();
    if (!json.latest) return new Response("no latest version", { status: 404 });
    return getPaths(module, json.latest);
  }

  return new Response("not found", { status: 404 });
}

async function getPaths(module: string, version: string): Promise<Response> {
  const resp = await fetch(
    `${S3_BUCKET}${module}/versions/${version}/meta/meta.json`
  );
  if (resp.status === 403 || resp.status === 404)
    return new Response("module or version not found", { status: 404 });
  if (!resp.ok) return new Response("internal server error 2", { status: 500 });
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
        f.endsWith(".mjs")
    );
  return new Response(JSON.stringify(list), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "max-age=86400",
    },
  });
}
