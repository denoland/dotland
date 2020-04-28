/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import DATABASE from "../database.json";
import { github, GithubEntry } from "./registries/github";
import { url, URLEntry } from "./registries/url";
import { DirEntry, Entry } from "./registries";

export function find(name: string): GithubEntry | URLEntry {
  // @ts-ignore
  return DATABASE[name];
}

export function getSourceURL(
  name: string,
  path: string,
  version?: string
): string | null {
  const entry = find(name);
  switch (entry?.type) {
    case "github":
      return github.getSourceURL(entry, path, version);
    case "url":
      return url.getSourceURL(entry, path, version);
    default:
      return null;
  }
}
export function getRepositoryURL(
  name: string,
  path: string,
  version?: string
): string | null {
  const entry = find(name);
  switch (entry?.type) {
    case "github":
      return github.getRepositoryURL(entry, path, version);
    case "url":
      return url.getRepositoryURL(entry, path, version);
    default:
      return null;
  }
}
export async function getDirectoryListing(
  name: string,
  path: string,
  version?: string
): Promise<DirEntry[] | null> {
  const entry = find(name);
  switch (entry?.type) {
    case "github":
      return github.getDirectoryListing(entry, path, version);
    case "url":
      return url.getDirectoryListing(entry, path, version);
    default:
      return null;
  }
}

export async function getVersionList(name: string): Promise<string[] | null> {
  const entry = find(name);
  switch (entry?.type) {
    case "github":
      return github.getVersionList(entry);
    case "url":
      return url.getVersionList(entry);
    default:
      return null;
  }
}
export function parseNameVersion(nameVersion: string) {
  const [name, version] = nameVersion.split("@", 2);
  return [name, version as string | undefined] as const;
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
  return filename.toLowerCase() === "readme.md";
}

export const entries = DATABASE as { [name: string]: Entry };
