// Copyright 2022 the Deno authors. All rights reserved. MIT license.

export const CDN_ENDPOINT = "https://cdn.deno.land/";
const API_ENDPOINT = "https://api.deno.land/";

export interface CommonProps {
  /** data of a version */
  versionMeta: VersionMetaInfo;
  /** misc info of a module */
  moduleMeta: Module | null;
  /** files and directories in module */
  dirEntries: DirEntry[] | null;

  isStd: boolean;
  /** module name */
  name: string;
  /** module version */
  version: string;
  /** path in module */
  path: string;

  /** readme for current path */
  readme: Readme | null;

  /** url of the repo */
  repositoryURL: string;
  /** base path of the module (/x/[name]@[version]) */
  basePath: string;
  /** request URL */
  url: URL;
}

export function getDirEntries(
  versionMeta: VersionMetaInfo,
  path: string,
): DirEntry[] | null {
  const files = versionMeta.directoryListing
    .filter(
      (f) =>
        f.path.startsWith(path + "/") &&
        f.path.split("/").length - 2 === path.split("/").length - 1,
    )
    .map<DirEntry>((f) => {
      const [name] = f.path.slice(path.length + 1).split("/");
      return {
        name,
        size: f.size,
        type: f.type,
      };
    })
    .sort((a, b) => a.name.codePointAt(0)! - b.name.codePointAt(0)!);
  return files.length === 0 ? null : files;
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
  path: string,
  canonicalPath: string,
  versionMeta: VersionMetaInfo,
  dirEntries: DirEntry[] | null,
): Promise<Readme | null> {
  const readmeEntry = path === ""
    ? findRootReadme(versionMeta.directoryListing)
    : dirEntries?.find((d) => isReadme(d.name));

  if (readmeEntry) {
    const url = getSourceURL(name, version, path + "/" + readmeEntry.name);

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
          path + "/" + readmeEntry.name,
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

  if (
    versionMeta.directoryListing.filter((d) =>
      d.path === path && d.type == "file"
    ).length !== 0
  ) {
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
  } else {
    return null;
  }
}

export interface DirEntry {
  name: string;
  type: "file" | "dir" | "symlink";
  size?: number;
  target?: string;
}

export interface Entry extends DirEntry {
  path?: string;
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
  meta: VersionMetaInfo,
  path: string,
  type = "blob",
): string {
  return `https://github.com/${
    pathJoin(
      meta.uploadOptions.repository,
      type,
      meta.uploadOptions.ref,
      meta.uploadOptions.subdir ?? "",
      path,
    )
  }`;
}

export interface VersionMetaInfo {
  uploadedAt: Date;
  directoryListing: DirListing[];
  uploadOptions: UploadOptions;
}

export interface UploadOptions {
  type: "github";
  repository: string;
  subdir?: string;
  ref: string;
}

export interface DirListing {
  path: string;
  type: "dir" | "file";
  size?: number;
}

export async function getVersionMeta(
  module: string,
  version: string,
): Promise<VersionMetaInfo> {
  const url = `${CDN_ENDPOINT}${module}/versions/${
    encodeURIComponent(
      version,
    )
  }/meta/meta.json`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (res.status === 403 || res.status === 404) {
    await res.body?.cancel();
    throw new Error("Version Meta Not Found");
  }
  if (res.status !== 200) {
    throw Error(
      `Got an error (${res.status}) while getting the directory listing:\n${await res
        .text()}`,
    );
  }

  const meta = await res.json();
  if (!meta) throw new Error("Version Meta missing");

  return {
    uploadedAt: new Date(meta.uploaded_at),
    directoryListing: meta.directory_listing,
    uploadOptions: meta.upload_options,
  };
}

export interface VersionDeps {
  graph: DependencyGraph;
}

export interface DependencyGraph {
  nodes: {
    [url: string]: {
      deps: string[];
      size: number;
    };
  };
}

export async function getVersionDeps(
  module: string,
  version: string,
): Promise<VersionDeps | null> {
  const url = `${CDN_ENDPOINT}${module}/versions/${
    encodeURIComponent(
      version,
    )
  }/meta/deps_v2.json`;
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
      `Got an error (${res.status}) while getting the dependency information:\n${await res
        .text()}`,
    );
  }
  const meta = await res.json();
  if (!meta) return null;
  return {
    graph: meta.graph,
  };
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

export async function getModule(name: string): Promise<Module> {
  const url = `${API_ENDPOINT}modules/${encodeURIComponent(name)}`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (res.status === 404) {
    await res.body?.cancel();
    throw new Error("Module Not Found");
  }
  if (res.status !== 200) {
    throw Error(
      `Got an error (${res.status}) while getting the module ${name}:\n${await res
        .text()}`,
    );
  }
  const data = await res.json();
  if (!data.success) {
    throw Error(
      `Got an error (${data.info}) while getting the module ${name}:\n${await res
        .text()}`,
    );
  }
  return data.data;
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

const ROOT_README_REGEX = new RegExp(
  `^\\/(docs\\/|\\.github\\/)?${readmeBaseRegex}$`,
  "i",
);
export function findRootReadme(
  directoryListing: DirListing[],
): DirEntry | undefined {
  const listing =
    directoryListing.filter((d) => ROOT_README_REGEX.test(d.path)).sort((
      a,
      b,
    ) => a.path.length - b.path.length)[0];

  return listing
    ? {
      name: listing.path.substring(1),
      type: listing.type,
      size: listing.size,
    }
    : undefined;
}

const README_REGEX = new RegExp(`^${readmeBaseRegex}$`, "i");
export function isReadme(filename: string): boolean {
  return README_REGEX.test(filename);
}

export type Dep = { name: string; children: Dep[] };

export function graphToTree(
  graph: DependencyGraph,
  name: string,
  visited: string[] = [],
): Dep | undefined {
  const dep = graph.nodes[name];
  if (dep === undefined) return undefined;
  visited.push(name);
  return {
    name,
    children: dep.deps
      .filter((n) => !visited.includes(n))
      .map((n) => graphToTree(graph, n, visited)!),
  };
}

export function flattenGraph(
  graph: DependencyGraph,
  name: string,
  visited: string[] = [],
): string[] | undefined {
  const dep = graph.nodes[name];
  if (dep === undefined) return undefined;
  visited.push(name);
  dep.deps
    .filter((n) => !visited.includes(n))
    .forEach((n) => flattenGraph(graph, n, visited)!);
  return visited;
}

function matchX(url: string) {
  const match = url.match(/^https:\/\/deno\.land\/x\/([^/]+)(.+)$/);
  if (!match) return undefined;
  return {
    identifier: match[1],
    path: match[2],
  };
}

function matchStd(url: string) {
  const match = url.match(/^https:\/\/deno\.land\/(x\/)?std(@([^/]+))?(.+)?$/);
  if (!match) return undefined;
  return {
    version: match[2],
    submodule: match[4],
    path: match[5],
  };
}

export function listExternalDependencies(
  graph: DependencyGraph,
  name: string,
): string[] | undefined {
  const visited = flattenGraph(graph, name);
  const denolandDeps = new Set<string>();
  const nestlandDeps = new Set<string>();
  const rawGithubDeps = new Set<string>();
  const jspmDeps = new Set<string>();
  const depJsDeps = new Set<string>();
  const other = new Set<string>();
  if (visited) {
    visited.forEach((dep) => {
      // Count /std only once
      const std = matchStd(dep);
      if (std) {
        denolandDeps.add(`https://deno.land/std${std.version ?? ""}`);
        return;
      }

      // Count each module on /x only once.
      const x = matchX(dep);
      if (x) {
        denolandDeps.add(`https://deno.land/x/${x.identifier}`);
        return;
      }

      // Count each module on nest only once.
      const nest = dep.match(/^https:\/\/x\.nest\.land\/([^/]+)(.+)$/);
      if (nest) {
        nestlandDeps.add(`https://nest.land/packages/${nest[1]}`);
        return;
      }

      // Count each module on raw.githubusercontent.com only once.
      const rawGithub = dep.match(
        /^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)(.+)$/,
      );
      if (rawGithub) {
        rawGithubDeps.add(
          `https://github.com/${rawGithub[1]}/${rawGithub[2]}/tree/${
            rawGithub[3]
          }`,
        );
        return;
      }

      // Count each module on raw.githubusercontent.com only once.
      const jspm = dep.match(
        /^https:\/\/dev\.jspm\.io\/(npm:)?(@([^/@]+)\/([^/@]+)|([^/@]+))@(\d\.\d\.\d)(.+)$/,
      );
      if (jspm) {
        jspmDeps.add(`https://dev.jspm.io/${jspm[2]}@${jspm[6]}`);
        return;
      }
      if (dep.startsWith("https://dev.jspm.io")) return;

      // Count each module on cdn.depjs.com only once.
      const depJs = dep.match(/^https:\/\/cdn\.depjs\.com\/([^/]+)(.+)$/);
      if (depJs) {
        depJsDeps.add(`https://cdn.depjs.com/${depJs[1]}`);
        return;
      }

      // Ignore pika internal imports
      if (dep.startsWith("https://cdn.pika.dev/-/")) return;

      other.add(dep);
    });
    const thisStd = matchStd(name);
    if (thisStd) {
      denolandDeps.delete(`https://deno.land/std${thisStd.version ?? ""}`);
    }
    const thisX = matchX(name);
    if (thisX) {
      denolandDeps.delete(`https://deno.land/x/${thisX.identifier}`);
    }
    return [
      ...denolandDeps,
      ...nestlandDeps,
      ...rawGithubDeps,
      ...jspmDeps,
      ...depJsDeps,
      ...other,
    ].map((url) =>
      url.replace("https://deno.land/x/std", "https://deno.land/std")
    );
  } else return undefined;
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
