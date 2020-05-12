/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import DATABASE from "../database.json";
import { GithubEntry, GithubDatabaseEntry } from "./registries/github";
import { DenoStdEntry, DenoStdDatabaseEntry } from "./registries/deno_std";
import { URLEntry, URLDatabaseEntry } from "./registries/url";
import { NPMEntry, NPMDatabaseEntry } from "./registries/npm";
import { Entry, DatabaseEntry } from "./registries";

function findDatabaseEntry(
  name: string
):
  | GithubDatabaseEntry
  | DenoStdDatabaseEntry
  | URLDatabaseEntry
  | NPMDatabaseEntry
  | undefined {
  // @ts-ignore
  return DATABASE[name];
}

export function findEntry(name: string): Entry | null {
  const dbEntry = findDatabaseEntry(name);
  switch (dbEntry?.type) {
    case "github":
      return new GithubEntry(dbEntry);
    case "deno_std":
      return new DenoStdEntry(dbEntry);
    case "url":
      return new URLEntry(dbEntry);
    case "npm":
      return new NPMEntry(dbEntry);
    default:
      return null;
  }
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
  return (
    filename.toLowerCase() === "readme.md" ||
    filename.toLowerCase() === "readme"
  );
}

export const entries = DATABASE as { [name: string]: DatabaseEntry };
