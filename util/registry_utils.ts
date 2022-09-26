// Copyright 2022 the Deno authors. All rights reserved. MIT license.

export const CDN_ENDPOINT = "https://cdn.deno.land/";
const API_ENDPOINT = "https://api.deno.land/";

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
  } else if (f.match(/\.(png|jpe?g|svg)/)) {
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

function docAsDescription(doc: string) {
  return doc.split("\n\n")[0].slice(0, 199);
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

import type { DocNode, DocNodeKind, JsDoc } from "$deno_doc/types.d.ts";

/** Stored as kind `module_entry` in datastore. */
export interface ModuleEntry {
  path: string;
  type: "file" | "dir";
  size: number;
  /** For `"dir"` entries, indicates if there is a _default_ module that should
   * be used within the directory. */
  default?: string;
  /** For `"dir"` entries, an array of child sub-directory paths. */
  dirs?: string[];
  /** For `"file`" entries, indicates if the entry id can be queried for doc
   * nodes. */
  docable?: boolean;
  /** For `"dir"` entries, an array of docable child paths that are not
   * "ignored". */
  index?: string[];
}

/** Defines a tag related to how popular a module is. */
export interface PopularityModuleTag {
  kind: "popularity";
  value: "top_1_percent" | "top_5_percent" | "top_10_percent";
}

/** Defines a "tag" which can be displayed when rending a module or part of a
 * module. */
export type ModuleTag = PopularityModuleTag;

export interface PageBase {
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
  category?: string;
  jsDoc?: JsDoc | null;
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
}

export interface DocPageFile extends PageBase {
  kind: "file";
}

interface ModInfoDependency {
  kind: "denoland" | "esm" | "github" | "skypack" | "other";
  package: string;
  version: string;
}

export interface ModInfoPage {
  kind: "modinfo";
  module: string;
  description?: string;
  version: string;
  versions: string[];
  latest_version: string;
  /** An array of dependencies identified for the module. */
  dependencies?: ModInfoDependency[];
  /** The default module for the module. */
  defaultModule?: ModuleEntry;
  /** A flag that indicates if the default module has a default export. */
  defaultExport?: boolean;
  /** The file entry for the module that is a README to be rendered. */
  readme?: ModuleEntry;
  readmeFile?: string;
  /** The file entry for the module that has a detectable deno configuration. */
  config?: ModuleEntry;
  /** The file entry for an import map specified within the detectable config
   * file. */
  importMap?: ModuleEntry;
  uploaded_at: string;
  upload_options: {
    type: string;
    repository: string;
    ref: string;
    subdir?: string;
  };
  tags?: ModuleTag[];
}

export type InfoPage = ModInfoPage | PageInvalidVersion | PageNoVersions;

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

interface DocPageLibraryBase {
  kind: string;
  name: string;
  version: string;
  versions: string[];
  latest_version: string;
}

export interface DocPageLibrary extends DocPageLibraryBase {
  kind: "library";
  items: SymbolItem[];
}

export interface DocPageLibrarySymbol extends DocPageLibraryBase {
  kind: "librarySymbol";
  items: SymbolItem[];
  name: string;
  docNodes: DocNode[];
}

export interface DocPageLibraryInvalidVersion {
  kind: "libraryInvalidVersion";
  name: string;
  versions: string[];
  latest_version: string;
}

export type LibDocPage =
  | DocPageLibrary
  | DocPageLibrarySymbol
  | DocPageLibraryInvalidVersion;

export interface SourcePageFile extends PageBase {
  kind: "file";
  size: number;
  /** Indicates if the page is docable or not. */
  docable?: boolean;
  file: RawFile | Error;
}

export interface SourcePageDirEntry {
  path: string;
  kind: "file" | "dir";
  size: number;
  /** Indicates if the page is docable or not. */
  docable?: boolean;
}

export interface SourcePageDir extends PageBase {
  kind: "dir";
  entries: SourcePageDirEntry[];
}

export type SourcePage =
  | SourcePageFile
  | SourcePageDir
  | PageInvalidVersion
  | PageNoVersions
  | PagePathNotFound;
