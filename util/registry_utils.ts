/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

const S3_BUCKET =
  "https://deno-registry2-storagebucket-fklr2u336n14.s3.us-east-2.amazonaws.com/";

export interface DirEntry {
  name: string;
  type: "file" | "dir" | "symlink";
  size?: number;
  target?: string;
}

export function getSourceURL(
  module: string,
  version: string,
  path: string,
): string {
  return `${S3_BUCKET}${module}/versions/${version}/raw${path}`;
}

export function getRepositoryURL(
  meta: MetaInfo,
  version: string,
  path: string,
): string | undefined {
  switch (meta?.type) {
    case "github":
      return `https://github.com/${meta.repository}/tree/${version}${path}`;
    default:
      return undefined;
  }
}

export interface DirListing {
  path: string;
  type: "dir" | "file";
  size?: number;
}

export async function getDirectoryListing(
  module: string,
  version: string,
): Promise<DirListing[] | null> {
  const url =
    `${S3_BUCKET}${module}/versions/${version}/meta/directory_listing.json`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (res.status === 403 || res.status === 404) return null;
  if (res.status !== 200) {
    throw Error(
      `Got an error (${res.status}) while getting the directory listing:\n${await res
        .text()}`,
    );
  }
  return await res.json();
}

export interface VersionInfo {
  latest: string;
  versions: string[];
}

export async function getVersionList(
  module: string,
): Promise<VersionInfo | null> {
  const url = `${S3_BUCKET}${module}/meta/versions.json`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (res.status === 403 || res.status === 404) return null;
  if (res.status !== 200) {
    throw Error(
      `Got an error (${res.status}) while getting the version list:\n${await res
        .text()}`,
    );
  }
  return res.json();
}

export interface MetaInfo {
  type: "github";
  repository: string;
}

export async function getMeta(
  module: string,
): Promise<MetaInfo | null> {
  const url = `${S3_BUCKET}${module}/meta/meta.json`;
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });
  if (res.status === 403 || res.status === 404) return null;
  if (res.status !== 200) {
    throw Error(
      `Got an error (${res.status}) while getting the meta info:\n${await res
        .text()}`,
    );
  }
  return res.json();
}

export function parseNameVersion(
  nameVersion: string,
): [string, string] {
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
