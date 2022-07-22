// Copyright 2022 the Deno authors. All rights reserved. MIT license.

export const CDN_ENDPOINT = "https://cdn.deno.land/";
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
  canonicalPath: string,
  versionMeta: VersionMetaInfo,
  items: IndexItem[],
): Promise<Readme | null> {
  const readmeEntry = items.find((item) => isReadme(item.path.split("/").at(-1)!));

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
      return null;
    }
    if (readmeEntry.size! < MAX_SYNTAX_HIGHLIGHT_FILE_SIZE) {
      return {
        content: await res.text(),
        url,
        repositoryURL: getRepositoryURL(
          versionMeta,
          readmeEntry.path,
        ),
        canonicalPath: canonicalPath + "/" + readmeEntry.name,
      };
    } else {
      await res.body!.cancel();
      return null;
    }
  } else {
    return null;
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
  canonicalPath: string,
  versionMeta: VersionMetaInfo,
): Promise<RawFile | Error | null> {
  const url = getSourceURL(name, version, path);

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    await res.body?.cancel();
    if (
      res.status !== 400 &&
      res.status !== 403 &&
      res.status !== 404
    ) {
      console.error(new Error(`${res.status}: ${res.statusText}`));
    }
    return null;
  }

  const size = versionMeta.directoryListing.find(
    (entry) => entry.path === path,
  )!.size!;

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
  return encodeURI(`${CDN_ENDPOINT}${module}/versions/${version}/raw${path}`);
}

function pathJoin(...parts: string[]) {
  const replace = new RegExp("/{1,}", "g");
  return parts.join("/").replace(replace, "/");
}

export function getRepositoryURL(
  meta: {
    repository: string;
    ref: string;
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
): Promise<VersionInfo | null> {
  const url = `${CDN_ENDPOINT}${module}/meta/versions.json`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
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
  description: string;
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
const readmeBaseRegex = `readme(?:\\.(${markdownExtension}|${orgExtension}))?`;

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

const README_REGEX = new RegExp(`^${readmeBaseRegex}$`, "i");
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
  }) + path;
}

export const S3_BUCKET =
  "http://deno-registry2-prod-storagebucket-b3a31d16.s3-website-us-east-1.amazonaws.com/";

export async function fetchSource(remoteUrl: string): Promise<Response> {
  let lastErr;
  for (let i = 0; i < 3; i++) {
    try {
      const resp = await fetch(remoteUrl);
      if (resp.status === 403 || resp.status === 404) {
        await resp.body?.cancel();
        return new Response("404 Not Found", { status: 404 });
      }
      if (!resp.ok) {
        await resp.body?.cancel();
        throw new TypeError("non 2xx status code returned");
      }
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

import type { DocNode, DocNodeKind, JsDoc } from "$deno_doc/types.d.ts";

export interface DocPageBase {
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
  };
  /** @deprecated */
  star_count?: number;
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
}

export type DocPageNavItem = DocPageModuleItem | DocPageDirItem;

export interface DocPageSymbol extends DocPageBase {
  kind: "symbol";
  nav: DocPageNavItem[];
  name: string;
  docNodes: DocNode[];
}

export interface DocPageModule extends DocPageBase {
  kind: "module";
  nav: DocPageNavItem[];
  docNodes: DocNode[];
}

export interface DocPageIndex extends DocPageBase {
  kind: "index";
  items: IndexItem[];
}

export interface DocPageFile extends DocPageBase {
  kind: "file";
}

export interface DocPageInvalidVersion {
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
  | DocPageInvalidVersion;
