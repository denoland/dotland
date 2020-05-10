/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import DATABASE from "../database.json";
import { github, GithubEntry } from "./registries/github";
import { denoStd, DenoStdEntry } from "./registries/deno_std";
import { url, URLEntry } from "./registries/url";
import { npm, NPMEntry } from "./registries/npm";
import { DirEntry, Entry, Registry } from "./registries";

export function find(
  name: string
): GithubEntry | DenoStdEntry | URLEntry | NPMEntry {
  // @ts-ignore
  return DATABASE[name];
}

function registryByType(type?: string): Registry<Entry> | null {
  switch (type) {
    case "github":
      return github;
    case "deno_std":
      return denoStd;
    case "url":
      return url;
    case "npm":
      return npm;
    default:
      return null;
  }
}
export function getSourceURL(
  name: string,
  path: string,
  version?: string
): string | null {
  const entry = find(name);
  const registry = registryByType(entry?.type);
  return registry?.getSourceURL(entry, path, version) ?? null;
}

export function getRepositoryURL(
  name: string,
  path: string,
  version?: string
): string | null {
  const entry = find(name);
  const registry = registryByType(entry?.type);
  return registry?.getRepositoryURL(entry, path, version) ?? null;
}

export async function getDirectoryListing(
  name: string,
  path: string,
  version?: string
): Promise<DirEntry[] | null> {
  const entry = find(name);
  const registry = registryByType(entry?.type);
  return registry?.getDirectoryListing(entry, path, version) ?? null;
}

export async function getVersionList(name: string): Promise<string[] | null> {
  const entry = find(name);
  const registry = registryByType(entry?.type);
  return registry?.getVersionList(entry) ?? null;
}

export function getDefaultVersion(name: string): string | undefined {
  const entry = find(name);
  const registry = registryByType(entry?.type);
  return registry?.getDefaultVersion(entry);
}

export function parseNameVersion(
  nameVersion: string
): [string, string | undefined] {
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
