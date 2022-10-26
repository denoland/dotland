// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import compareVersions from "$tiny-version-compare";
import { join } from "$std/path/mod.ts";
import { getSourceURL } from "./registry_utils.ts";
import VERSIONS from "@/versions.json" assert { type: "json" };

const githubBasepath = "https://raw.githubusercontent.com/denoland/manual/";
const oldSourcepath = "https://github.com/denoland/deno/blob/";
const sourcepath = "https://github.com/denoland/manual/blob/";

export const versions = VERSIONS.cli;

export interface TableOfContents {
  [slug: string]: {
    name: string;
    children?: TableOfContents;
  } | string;
}

// Returns true if the version is of the 0.x release line, or between 1.0.0 and
// 1.12.0 inclusive. During this time the manual was part of the main repo. It
// is now a separate repo.
function isOldVersion(version: string) {
  return compareVersions(version, "v1.12.0") !== 1;
}

export function basepath(version: string) {
  const manualPath = Deno.env.get("MANUAL_PATH");
  if (manualPath) {
    return "file://" + join(Deno.cwd(), manualPath);
  }
  if (isPreviewVersion(version)) {
    return githubBasepath + version;
  }
  if (isOldVersion(version)) {
    return getSourceURL("deno", version, "/docs");
  }
  return getSourceURL("manual", version, "");
}

export async function getTableOfContents(
  version: string,
): Promise<TableOfContents> {
  const res = await fetch(`${basepath(version)}/toc.json`);
  if (res.status !== 200) {
    throw Error(
      `Got an error (${res.status}) while getting the manual table of contents:\n${await res
        .text()}`,
    );
  }
  return await res.json();
}

export function getFileURL(version: string, path: string): string {
  return `${basepath(version)}${path}.md`;
}

export function getDocURL(version: string, path: string): string {
  if (isOldVersion(version)) {
    return `${oldSourcepath}${version}/docs${path}.md`;
  }

  return `${sourcepath}${version}${path}.md`;
}

export function getDescription(content: string): string | undefined {
  const paras = content.split("\n\n");
  for (const para of paras) {
    if (para.match(/^[^#`]/)) {
      return para.slice(0, 199);
    }
  }
}

export function isPreviewVersion(version: string): boolean {
  return VERSIONS.cli.find((v) => v === version) === undefined;
}
