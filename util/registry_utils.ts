// Copyright 2022 the Deno authors. All rights reserved. MIT license.

const API_ENDPOINT = "https://api.deno.land/";

export interface CommonProps {
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
}

export function filetypeIsJS(filetype: string | undefined): boolean {
  return filetype === "javascript" || filetype === "typescript" ||
    filetype === "tsx" || filetype === "jsx";
}

// 100kb
export const MAX_SYNTAX_HIGHLIGHT_FILE_SIZE = 100 * 1024;
// 500kb
export const MAX_FILE_SIZE = 500 * 1024;

export interface Readme {
  content: string;
  canonicalPath: string;
  url: string;
  repositoryURL: string;
}

export async function getReadme(
  name: string,
  version: string,
  items: Array<{
    kind: string;
    path: string;
    size: number;
  }>,
  uploadOptions: {
    type: string;
    repository: string;
    ref: string;
  },
): Promise<Readme | undefined> {
  const readmeEntry = items.find((item) =>
    isReadme(item.path.split("/").at(-1)!)
  );

  if (readmeEntry) {
    const url = getSourceURL(name, version, readmeEntry.path);

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
    if (readmeEntry.size! < MAX_SYNTAX_HIGHLIGHT_FILE_SIZE) {
      return {
        content: await res.text(),
        url,
        repositoryURL: getRepositoryURL(
          uploadOptions,
          readmeEntry.path,
        ),
        canonicalPath: getBasePath({
          isStd: name === "std",
          name,
          version,
        }) + readmeEntry.path,
      };
    } else {
      await res.body!.cancel();
      return undefined;
    }
  } else {
    return undefined;
  }
}

export interface RawFile {
  content: string;
  highlight: boolean;
  url: string;
  canonicalPath: string;
}

export async function getRawFile(
  name: string,
  version: string,
  path: string,
): Promise<RawFile | Error> {
  const url = getSourceURL(name, version, path);
  const canonicalPath = getModulePath(name, version, path);

  const res = await fetch(url, { method: "GET" });
  const size = Number(res.headers.get("content-size")!);

  if (size < MAX_SYNTAX_HIGHLIGHT_FILE_SIZE) {
    return {
      content: await res.text(),
      highlight: true,
      url,
      canonicalPath,
    };
  } else if (size < MAX_FILE_SIZE) {
    return {
      content: await res.text(),
      highlight: false,
      url,
      canonicalPath,
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
  return encodeURI(`${S3_BUCKET}${module}/versions/${version}/raw${path}`);
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
  const url = `${S3_BUCKET}${module}/meta/versions.json`;
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

export interface Module {
  name: string;
  description?: string;
  star_count: string;
}

export interface SearchResult extends Module {
  search_score: string;
}

export interface ModulesList {
  results: SearchResult[];
  totalCount: number;
}

export async function listModules(
  page: number,
  limit: number,
  query: string,
): Promise<ModulesList | null> {
  const url = `${API_ENDPOINT}modules?page=${page}&limit=${limit}&query=${
    encodeURIComponent(
      query,
    )
  }`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (res.status !== 200) {
    throw Error(
      `Got an error (${res.status}) while getting the module list:\n${await res
        .text()}`,
    );
  }
  const data = await res.json();
  if (!data.success) {
    throw Error(
      `Got an error (${data.info}) while getting the module list:\n${await res
        .text()}`,
    );
  }

  return {
    totalCount: (query ? limit : data.data.total_count),
    results: data.data.results,
  };
}

export interface Build {
  id: string;
  options: {
    moduleName: string;
    type: string;
    repository: string;
    ref: string;
    version: string;
    subdir?: string;
  };
  status: string;
  message?: string;
}

export async function getBuild(id: string): Promise<Build | Error> {
  const url = `${API_ENDPOINT}builds/${id}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (res.status !== 200) {
    return Error(
      `Got an error (${res.status}) while getting the build info:\n${await res
        .text()}`,
    );
  }
  const data = await res.json();
  if (!data.success) {
    return Error(
      `Got an error (${data.info}) while getting the build info:\n${await res
        .text()}`,
    );
  }
  return data.data.build;
}

const markdownExtension = "(?:markdown|mdown|mkdn|mdwn|mkd|md)";
const orgExtension = "org";

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
  } else if (f.match(`\\.${markdownExtension}$`)) {
    return "markdown";
  } else if (f.match(`\\.${orgExtension}$`)) {
    return "org";
  } else if (f.match(/\.(png|jpe?g|svg)/)) {
    return "image";
  }
}

export function fileNameFromURL(url: string): string {
  const segments = decodeURI(url).split("/");
  return segments[segments.length - 1];
}

const README_REGEX = new RegExp(
  `^readme(?:\\.(${markdownExtension}|${orgExtension}))?$`,
  "i",
);
export function isReadme(filename: string): boolean {
  return README_REGEX.test(filename);
}

export interface Stats {
  recently_added_modules: Array<Module & { created_at: string }>;
  recently_uploaded_versions: Array<{
    name: string;
    version: string;
    created_at: string;
  }>;
}

export async function getStats(): Promise<Stats | null> {
  const url = `${API_ENDPOINT}stats`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (res.status !== 200) {
    throw Error(
      `Got an error (${res.status}) while getting the stats:\n${await res
        .text()}`,
    );
  }
  const data = await res.json();
  if (!data.success) {
    throw Error(
      `Got an error (${data.info}) while getting the stats:\n${await res
        .text()}`,
    );
  }

  return data.data;
}

export function getBasePath({
  isStd,
  name,
  version,
}: {
  isStd: boolean;
  name: string;
  version?: string;
}): string {
  return `${isStd ? "" : "/x"}/${name}${
    version ? `@${encodeURIComponent(version)}` : ""
  }`;
}

export function getModulePath(
  name: string,
  version: string | undefined,
  path: string | undefined,
) {
  const isStd = name === "std";
  return getBasePath({
    isStd,
    name,
    version,
  }) + (path ?? "");
}

export const S3_BUCKET =
  "https://deno-registry2-prod-storagebucket-b3a31d16.s3.amazonaws.com/";

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
        return new Response("404 Not Found", { status: 404 });
      }
      if (!resp.ok) {
        await resp.body?.cancel();
        throw new TypeError("non 2xx status code returned");
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

import type { DocNode, DocNodeKind, JsDoc } from "$deno_doc/types.d.ts";

/** Defines a tag related to how popular a module is. */
export interface PopularityModuleTag {
  kind: "popularity";
  value: "top_1_percent" | "top_5_percent" | "top_10_percent";
}

/** Defines a "tag" which can be displayed when rending a module or part of a
 * module. */
export type ModuleTag = PopularityModuleTag;

export interface PageBase {
  kind: string;
  module: string;
  description?: string;
  version: string;
  path: string;
  versions: string[];
  latest_version: string;
  uploaded_at: string;
  upload_options: {
    type: string;
    repository: string;
    ref: string;
    subdir?: string;
  };
  /** @deprecated */
  star_count?: number;
  tags?: ModuleTag[];
}

interface DocPageDirItem {
  kind: "dir";
  path: string;
}

interface SymbolItem {
  name: string;
  kind: DocNodeKind;
  jsDoc?: JsDoc;
}

export interface IndexItem {
  kind: "dir" | "module" | "file";
  path: string;
  size: number;
  ignored: boolean;
  doc?: string;
}

interface DocPageModuleItem {
  kind: "module";
  path: string;
  items: SymbolItem[];
  default?: true;
}

export type DocPageNavItem = DocPageModuleItem | DocPageDirItem;

export interface DocPageSymbol extends PageBase {
  kind: "symbol";
  nav: DocPageNavItem[];
  name: string;
  docNodes: DocNode[];
}

export interface DocPageModule extends PageBase {
  kind: "module";
  nav: DocPageNavItem[];
  docNodes: DocNode[];
}

export interface DocPageIndex extends PageBase {
  kind: "index";
  items: IndexItem[];
  readme?: Readme;
}

export interface DocPageFile extends PageBase {
  kind: "file";
}

export interface PagePathNotFound extends PageBase {
  kind: "notfound";
}

export interface PageNoVersions {
  kind: "no-versions";
  module: string;
}

export interface PageInvalidVersion {
  kind: "invalid-version";
  module: string;
  description?: string;
  versions: string[];
  latest_version: string;
}

/** Stores as kind `doc_page` in datastore. */
export type DocPage =
  | DocPageSymbol
  | DocPageModule
  | DocPageIndex
  | DocPageFile
  | PageInvalidVersion
  | PageNoVersions
  | PagePathNotFound;

export interface CodePageFile extends PageBase {
  kind: "file";
  size: number;
  /** Indicates if the page is docable or not. */
  docable?: boolean;
  file: RawFile | Error;
}

export interface CodePageDirEntry {
  path: string;
  kind: "file" | "dir";
  size: number;
  /** Indicates if the page is docable or not. */
  docable?: boolean;
}

export interface CodePageDir extends PageBase {
  kind: "dir";
  entries: CodePageDirEntry[];
  readme?: Readme;
}

export type CodePage =
  | CodePageFile
  | CodePageDir
  | PageInvalidVersion
  | PageNoVersions
  | PagePathNotFound;
