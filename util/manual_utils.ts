// Copyright 2022 the Deno authors. All rights reserved. MIT license.

<<<<<<< HEAD
const githubBasepath = "https://cdn.jsdelivr.net/gh/denocn/deno_docs@";
const docpath = "https://github.com/denocn/deno_docs/blob/";
import VERSIONS from "../versions.json";
=======
const oldXBasepath = "https://deno.land/x/deno@";
const xBasepath = "https://deno.land/x/manual@";
const githubBasepath = "https://raw.githubusercontent.com/denoland/manual/";
const oldDocpath = "https://github.com/denoland/deno/blob/";
const docpath = "https://github.com/denoland/manual/blob/";
import VERSIONS from "../versions.json" assert { type: "json" };
import compareVersions from "https://esm.sh/tiny-version-compare@3.0.1";
>>>>>>> 536026728193c65673465483c3006267099de405

export const versions = VERSIONS.cli;

export interface TableOfContents {
  [slug: string]: {
    name: string;
    children?: {
      [slug: string]: string;
    };
  };
}

<<<<<<< HEAD
=======
// Returns true if the version is of the 0.x release line, or between 1.0.0 and
// 1.12.0 inclusive. During this time the manual was part of the main repo. It
// is now a separate repo.
function isOldVersion(version: string) {
  return compareVersions(version, "v1.12.0") !== 1;
}

export function basepath(version: string) {
  if (isPreviewVersion(version)) {
    return githubBasepath + version;
  }
  if (isOldVersion(version)) {
    return oldXBasepath + version + "/docs";
  }
  return xBasepath + version;
}

>>>>>>> 536026728193c65673465483c3006267099de405
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
