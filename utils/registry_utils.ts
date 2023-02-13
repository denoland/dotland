// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import type { DocNode } from "deno_doc/types";
import type { LibDocPage, ModuleEntry } from "$apiland_types";

const NAME_REGEX = /^[a-z0-9_]{3,40}$/;
export const CDN_ENDPOINT = "https://cdn.deno.land/";

export interface CommonProps<T> {
  isStd: boolean;
  /** module name */
  name: string;
  /** module version */
  version: string;
  /** path in module */
  path: string;
  /** request URL */
  url: URL;

  /** url of the repo */
  repositoryURL: string;

  data: T;
}

// 100kb
export const MAX_SYNTAX_HIGHLIGHT_FILE_SIZE = 100 * 1024;
// 500kb
export const MAX_FILE_SIZE = 500 * 1024;

export async function getReadme(
  name: string,
  version: string,
  entry: ModuleEntry,
): Promise<string | undefined> {
  const url = getSourceURL(name, version, entry.path);

  const res = await fetch(url);
  if (!res.ok) {
    await res.body?.cancel();
    if (
      res.status !== 400 &&
      res.status !== 403 &&
      res.status !== 404
    ) {
      console.error(new Error(`${res.status}: ${res.statusText}`));
    }
    return undefined;
  }
  if (entry.size < MAX_SYNTAX_HIGHLIGHT_FILE_SIZE) {
    return await res.text();
  } else {
    await res.body!.cancel();
    return undefined;
  }
}

export interface RawFile {
  content: string;
  highlight: boolean;
  url: string;
}

export async function getRawFile(
  name: string,
  version: string,
  path: string,
  size: number,
): Promise<RawFile | Error> {
  const url = getSourceURL(name, version, path);

  const res = await fetch(url, { method: "GET" });

  if (size < MAX_SYNTAX_HIGHLIGHT_FILE_SIZE) {
    return {
      content: await res.text(),
      highlight: true,
      url,
    };
  } else if (size < MAX_FILE_SIZE) {
    return {
      content: await res.text(),
      highlight: false,
      url,
    };
  } else {
    await res.body!.cancel();
    return new Error("Max display filesize exceeded");
  }
}

export function getSourceURL(
  module: string,
  version: string,
  path: string,
): string {
  return `${CDN_ENDPOINT}${encodeURIComponent(module)}` +
    `/versions/${encodeURIComponent(version)}/raw${encodeURI(path)}`;
}

function pathJoin(...parts: string[]) {
  const replace = new RegExp("/{1,}", "g");
  return parts.join("/").replace(replace, "/");
}

export function getRepositoryURL(
  meta: {
    repository: string;
    ref: string;
    subdir?: string;
  },
  path: string,
  type = "blob",
): string {
  return `https://github.com/${
    pathJoin(
      meta.repository,
      type,
      meta.ref,
      meta.subdir ?? "",
      path,
    )
  }`;
}

export interface VersionInfo {
  latest: string;
  versions: string[];
  isLegacy: true;
}

export async function getVersionList(
  module: string,
  signal?: AbortSignal,
): Promise<VersionInfo | null> {
  const url = `${CDN_ENDPOINT}${module}/meta/versions.json`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
    signal,
  });
  if (res.status === 403 || res.status === 404) {
    await res.body?.cancel();
    return null;
  }
  if (res.status !== 200) {
    throw Error(
      `Got an error (${res.status}) while getting the version list:\n${await res
        .text()}`,
    );
  }
  return res.json();
}

export function fileTypeFromURL(filename: string): string | undefined {
  const f = filename.toLowerCase();
  if (f.endsWith(".ts")) {
    return "typescript";
  } else if (f.endsWith(".js") || f.endsWith(".mjs") || f.endsWith(".cjs")) {
    return "javascript";
  } else if (f.endsWith(".tsx")) {
    return "tsx";
  } else if (f.endsWith(".jsx")) {
    return "jsx";
  } else if (f.endsWith(".json")) {
    return "json";
  } else if (f.endsWith(".toml")) {
    return "toml";
  } else if (f.endsWith(".lock")) {
    return "toml";
  } else if (f.endsWith(".rs")) {
    return "rust";
  } else if (f.endsWith(".py")) {
    return "python";
  } else if (f.endsWith(".wasm")) {
    return "wasm";
  } else if (f.toLocaleLowerCase().endsWith("makefile")) {
    return "makefile";
  } else if (f.endsWith(".dockerfile") || f.endsWith("dockerfile")) {
    return "dockerfile";
  } else if (f.endsWith(".yml") || f.endsWith(".yaml")) {
    return "yaml";
  } else if (f.endsWith(".htm") || f.endsWith(".html")) {
    return "html";
  } else if (f.match(`\\.(?:markdown|mdown|mkdn|mdwn|mkd|md)$`)) {
    return "markdown";
  } else if (f.match(`\\.org$`)) {
    return "org";
  } else if (f.match(/\.(png|jpe?g|svg|webm|webp|avif)/)) {
    return "image";
  }
}

export function getModulePath(
  name: string,
  version?: string,
  path?: string,
) {
  return `${name === "std" ? "" : "/x"}/${name}${
    version ? `@${encodeURIComponent(version)}` : ""
  }${path ?? ""}`;
}

export async function fetchSource(
  name: string,
  version: string,
  path: string,
): Promise<Response> {
  const url = getSourceURL(
    name,
    version,
    path.startsWith("/") ? path : `/${path}`,
  );

  let lastErr;
  for (let i = 0; i < 3; i++) {
    try {
      const resp = await fetch(url);
      if (resp.status === 403 || resp.status === 404) {
        await resp.body?.cancel();
        return new Response("404 Not Found", {
          status: 404,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }
      if (!resp.ok) {
        throw new TypeError(`non 2xx status code returned: ${resp.status}`, {
          cause: await resp.text(),
        });
      }

      const headers = new Headers(resp.headers);

      if (
        path.endsWith(".jsx") &&
        !headers.get("content-type")?.includes("javascript")
      ) {
        headers.set("content-type", "application/javascript");
      } else if (
        path.endsWith(".tsx") &&
        !headers.get("content-type")?.includes("typescript")
      ) {
        headers.set("content-type", "application/typescript");
      }

      headers.set("Access-Control-Allow-Origin", "*");

      return new Response(resp.body, {
        headers,
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

/** Matches to https://example.com/foo.ts type string */
const RE_IS_DENO_LAND_SCRIPT =
  /^https:\/\/deno\.land\/.*\.(ts|js|tsx|jsx|mts|cts|mjs|cjs)$/;
const RE_IS_SCRIPT = /\.(ts|js|tsx|jsx|mts|cts|mjs|cjs)$/;
/** Matches to ./path/to/foo.ts type string */
const RE_IS_RELATIVE_PATH_SCRIPT =
  /^\.\.?\/.*\.(ts|js|tsx|jsx|mts|cts|mjs|cjs)$/;

/** Tries to extract link target url from the given target specifier and baseUrl.
 * The return value is 3-tuple of the link url, the specifier, and the quote character.
 * Returns undefined if the target isn't url. */
export function extractLinkUrl(
  target: string,
  baseUrl: string,
): [string, string, string] | undefined {
  const quote = target[0];
  const specifier = target.slice(1, -1);
  if (RE_IS_DENO_LAND_SCRIPT.test(specifier)) {
    return [specifier, specifier, quote];
  } else if (
    RE_IS_RELATIVE_PATH_SCRIPT.test(specifier) &&
    RE_IS_SCRIPT.test(baseUrl)
  ) {
    try {
      return [new URL(specifier, baseUrl).href, specifier, quote];
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function docAsDescription(doc: string) {
  return doc.split("\n\n")[0].slice(0, 199);
}

/** Search parameters which are considered part of a canonical URL.  */
const CANONICAL_SEARCH_PARAMS = ["s", "source", "doc", "unstable"];

export function getCanonicalUrl(url: URL, latestVersion: string) {
  const canonical = new URL(url);
  canonical.hostname = "deno.land";
  canonical.port = "";
  canonical.protocol = "https:";
  canonical.pathname = canonical.pathname.replace(
    /@[^/]+/,
    `@${latestVersion}`,
  );
  canonical.search = "";
  for (const param of CANONICAL_SEARCH_PARAMS) {
    if (url.searchParams.has(param)) {
      canonical.searchParams.set(param, url.searchParams.get(param)!);
    }
  }
  return canonical;
}

/** For a LibDocPage, attempt to extract a description to be used with the
 * content meta for the page. */
export function getLibDocPageDescription(data: LibDocPage): string | undefined {
  if (data.kind === "librarySymbol") {
    for (const docNode of data.docNodes) {
      if (docNode.jsDoc?.doc) {
        return docAsDescription(docNode.jsDoc.doc);
      }
    }
  }
}

export function getDocAsDescription(
  docNodes: DocNode[],
  modDoc = false,
): string | undefined {
  for (const docNode of docNodes) {
    if (modDoc) {
      if (docNode.kind === "moduleDoc") {
        if (docNode.jsDoc.doc) {
          return docAsDescription(docNode.jsDoc.doc);
        } else {
          return;
        }
      }
    } else if (docNode.jsDoc?.doc) {
      return docAsDescription(docNode.jsDoc.doc);
    }
  }
}

export async function validateModuleName(
  name: string,
  controller: AbortController,
) {
  if (name === "" || !NAME_REGEX.test(name)) {
    return "invalid";
  } else {
    return await getVersionList(name, controller.signal)
      .then((e) => !e)
      .catch(() => false);
  }
}
