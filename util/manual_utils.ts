/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

const githubBasepath = "https://cdn.jsdelivr.net/gh/denocn/deno_docs@";
const docpath = "https://github.com/denocn/deno_docs/blob/";
import VERSIONS from "../versions.json";

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

function basepath(version: string) {
  if (isPreviewVersion(version)) {
    return githubBasepath + version;
  }
  if (isOldVersion(version)) {
    return oldXBasepath + version + "/docs";
  }
  return xBasepath + version;
}

>>>>>>> f1ba74327b401b47de678f30d768ff9bf54494b6
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

export async function getTableOfContentsMap(
  version: string,
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const tableOfContents = await getTableOfContents(version);

  Object.entries(tableOfContents).forEach(([slug, entry]) => {
    if (entry.children) {
      Object.entries(entry.children).forEach(([childSlug, name]) => {
        map.set(`/${slug}/${childSlug}`, name);
      });
    }
    map.set(`/${slug}`, entry.name);
  });

  return map;
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
