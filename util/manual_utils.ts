// Copyright 2022 the Deno authors. All rights reserved. MIT license.

<<<<<<< HEAD
const xBasepath = "https://deno.land/x/manual@";
const githubBasepath = "https://cdn.jsdelivr.net/gh/denocn/deno_docs@";
const docpath = "https://github.com/denocn/deno_docs/blob/";
import VERSIONS from "../versions.json" assert { type: "json" };

=======
const githubBasepath = "https://raw.githubusercontent.com/denoland/manual/";
const oldDocpath = "https://github.com/denoland/deno/blob/";
const docpath = "https://github.com/denoland/manual/blob/";
import VERSIONS from "../versions.json" assert { type: "json" };
import { getSourceURL } from "./registry_utils.ts";
import { compareVersions } from "../deps.ts";
>>>>>>> 4e87b753e583a55580c8b2559e0657f4cd85af1f
export const versions = VERSIONS.cli;

export interface TableOfContents {
  [slug: string]: {
    name: string;
    children?: {
      [slug: string]: string;
    };
  };
}

export function basepath(version: string) {
  if (isPreviewVersion(version)) {
    return githubBasepath + version;
  }
<<<<<<< HEAD
  return xBasepath + version;
=======
  if (isOldVersion(version)) {
    return getSourceURL("deno", version, "/docs");
  }
  return getSourceURL("manual", version, "");
>>>>>>> 4e87b753e583a55580c8b2559e0657f4cd85af1f
}

export async function getTableOfContents(
  version: string,
): Promise<TableOfContents> {
  version = "master";
  const res = await fetch(`${githubBasepath}${version}/toc.json`);
  if (res.status !== 200) {
    throw Error(
      `Got an error (${res.status}) while getting the manual table of contents:\n${await res
        .text()}`,
    );
  }
  return await res.json();
}

export function getFileURL(version: string, path: string): string {
  version = "master";
  return `${githubBasepath}${version}${path}.md`;
}

export function getDocURL(version: string, path: string): string {
  version = "master";
  return `${docpath}${version}${path}.md`;
}

export function isPreviewVersion(version: string): boolean {
  return VERSIONS.cli.find((v) => v === version) === undefined;
}
