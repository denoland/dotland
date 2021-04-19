/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

const CDN_ENDPOINT = "https://cdn.deno.land/";
const API_ENDPOINT = "https://api.deno.land/";

export interface DirEntry {
  name: string;
  type: "file" | "dir" | "symlink";
  size?: number;
  target?: string;
}

export function getSourceURL(
  module: string,
  version: string,
  path: string
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
  type = "blob"
): string | undefined {
  switch (meta.uploadOptions.type) {
    case "github":
      return `https://github.com/${pathJoin(
        meta.uploadOptions.repository,
        type,
        meta.uploadOptions.ref,
        meta.uploadOptions.subdir ?? "",
        path
      )}`;
    default:
      return undefined;
  }
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
  version: string
): Promise<VersionMetaInfo | null> {
  const url = `${CDN_ENDPOINT}${module}/versions/${encodeURIComponent(
    version
  )}/meta/meta.json`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (res.status === 403 || res.status === 404) return null;
  if (res.status !== 200) {
    throw Error(
      `Got an error (${
        res.status
      }) while getting the directory listing:\n${await res.text()}`
    );
  }

  const meta = await res.json();
  if (!meta) return null;

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
  version: string
): Promise<VersionDeps | null> {
  const url = `${CDN_ENDPOINT}${module}/versions/${encodeURIComponent(
    version
  )}/meta/deps_v2.json`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (res.status === 403 || res.status === 404) return null;
  if (res.status !== 200) {
    throw Error(
      `Got an error (${
        res.status
      }) while getting the dependency information:\n${await res.text()}`
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
  module: string
): Promise<VersionInfo | null> {
  const url = `${CDN_ENDPOINT}${module}/meta/versions.json`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (res.status === 403 || res.status === 404) return null;
  if (res.status !== 200) {
    throw Error(
      `Got an error (${
        res.status
      }) while getting the version list:\n${await res.text()}`
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

export async function listModules(
  page: number,
  limit: number,
  query: string
): Promise<{ results: SearchResult[]; totalCount: number } | null> {
  const url = `${API_ENDPOINT}modules?page=${page}&limit=${limit}&query=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (res.status !== 200) {
    throw Error(
      `Got an error (${
        res.status
      }) while getting the module list:\n${await res.text()}`
    );
  }
  const data = await res.json();
  if (!data.success) {
    throw Error(
      `Got an error (${
        data.info
      }) while getting the module list:\n${await res.text()}`
    );
  }

  return { totalCount: data.data.total_count, results: data.data.results };
}

export async function getModule(name: string): Promise<Module | null> {
  const url = `${API_ENDPOINT}modules/${encodeURIComponent(name)}`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (res.status === 404) return null;
  if (res.status !== 200) {
    throw Error(
      `Got an error (${
        res.status
      }) while getting the module ${name}:\n${await res.text()}`
    );
  }
  const data = await res.json();
  if (!data.success) {
    throw Error(
      `Got an error (${
        data.info
      }) while getting the module ${name}:\n${await res.text()}`
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

export async function getBuild(id: string): Promise<Build> {
  const url = `${API_ENDPOINT}builds/${id}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (res.status !== 200) {
    throw Error(
      `Got an error (${
        res.status
      }) while getting the build info:\n${await res.text()}`
    );
  }
  const data = await res.json();
  if (!data.success) {
    throw Error(
      `Got an error (${
        data.info
      }) while getting the build info:\n${await res.text()}`
    );
  }
  return data.data.build;
}

export function parseNameVersion(nameVersion: string): [string, string] {
  const [name, ...version] = nameVersion.split("@");
  return [name, version.join("@")];
}

export function fileTypeFromURL(filename: string): string | undefined {
  const f = filename.toLowerCase();
  if (f.endsWith(".ts")) {
    return "typescript";
  } else if (f.endsWith(".js")) {
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
  } else if (
    f.endsWith(".md") ||
    f.endsWith(".markdown") ||
    f.endsWith(".mdown") ||
    f.endsWith(".mkdn") ||
    f.endsWith(".mdwn") ||
    f.endsWith(".mkd")
  ) {
    return "markdown";
  } else if (f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg")) {
    return "image";
  }
}

export function fileNameFromURL(url: string): string {
  const segments = decodeURI(url).split("/");
  return segments[segments.length - 1];
}

export function denoDocAvailableForURL(filename: string): boolean {
  const filetype = fileTypeFromURL(filename);
  switch (filetype) {
    case "javascript":
    case "typescript":
    case "jsx":
    case "tsx":
      return true;
    default:
      return false;
  }
}

export function findRootReadme(
  directoryListing: DirListing[] | undefined
): DirEntry | undefined {
  const listing = directoryListing?.find((d) =>
    /^\/(docs\/|\.github\/)?readme(\.markdown|\.mdown|\.mkdn|\.mdwn|\.mkd|\.md)?$/i.test(
      d.path
    )
  );
  return listing
    ? {
        name: listing.path.substring(1),
        type: listing.type,
        size: listing.size,
      }
    : undefined;
}

export function isReadme(filename: string): boolean {
  return /^readme(\.markdown|\.mdown|\.mkdn|\.mdwn|\.mkd|\.md)?$/i.test(
    filename
  );
}

export type Dep = { name: string; children: Dep[] };

export function graphToTree(
  graph: DependencyGraph,
  name: string,
  visited: string[] = []
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
  visited: string[] = []
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
  name: string
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
        /^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)(.+)$/
      );
      if (rawGithub) {
        rawGithubDeps.add(
          `https://github.com/${rawGithub[1]}/${rawGithub[2]}/tree/${rawGithub[3]}`
        );
        return;
      }

      // Count each module on raw.githubusercontent.com only once.
      const jspm = dep.match(
        /^https:\/\/dev\.jspm\.io\/(npm:)?(@([^/@]+)\/([^/@]+)|([^/@]+))@(\d\.\d\.\d)(.+)$/
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

export async function getStats(): Promise<{
  recently_added_modules: Array<Module & { created_at: string }>;
  recently_uploaded_versions: Array<{
    name: string;
    version: string;
    created_at: string;
  }>;
} | null> {
  const url = `${API_ENDPOINT}stats`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (res.status !== 200) {
    throw Error(
      `Got an error (${
        res.status
      }) while getting the stats:\n${await res.text()}`
    );
  }
  const data = await res.json();
  if (!data.success) {
    throw Error(
      `Got an error (${
        data.info
      }) while getting the stats:\n${await res.text()}`
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
