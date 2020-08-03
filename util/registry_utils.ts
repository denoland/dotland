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
  path: string
): string | undefined {
  switch (meta.uploadOptions.type) {
    case "github":
      return `https://github.com/${pathJoin(
        meta.uploadOptions.repository,
        "tree",
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
  subdir: string | null;
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
  const url = `${CDN_ENDPOINT}${module}/versions/${version}/meta/meta.json`;
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

export interface SearchResult {
  name: string;
  description: string;
  type: "github";
  owner: string;
  repository: string;
  star_count: string;
  search_score: string;
}

export async function getModules(
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
  const [name, version] = nameVersion.split("@", 2);
  return [name, version];
}

export function fileTypeFromURL(filename: string) {
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
  } else if (f.endsWith(".dockerfile") || f.endsWith("Dockerfile")) {
    return "dockerfile";
  } else if (f.endsWith(".yml") || f.endsWith(".yaml")) {
    return "yaml";
  } else if (f.endsWith(".htm") || f.endsWith(".html")) {
    return "html";
  } else if (f.endsWith(".md")) {
    return "markdown";
  } else if (f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg")) {
    return "image";
  }
}

export function denoDocAvailableForURL(filename: string) {
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

export function isReadme(filename: string) {
  return (
    filename.toLowerCase() === "readme.md" ||
    filename.toLowerCase() === "readme"
  );
}
