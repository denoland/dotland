// Copyright 2022 the Deno authors. All rights reserved. MIT license.

const xBasepath = "https://deno.land/x/manual@";
const githubBasepath = "https://cdn.jsdelivr.net/gh/denocn/deno_docs@";
const docpath = "https://github.com/denocn/deno_docs/blob/";
import VERSIONS from "../versions.json" assert { type: "json" };
<<<<<<< HEAD
=======
import compareVersions from "https://esm.sh/tiny-version-compare@3.0.1?pin=v73";
>>>>>>> 45c9b2f33a8a3b037c0a55d18f637f51059caa33

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
  return xBasepath + version;
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
