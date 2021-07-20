/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

const oldXBasepath = "https://deno.land/x/deno@";
const xBasepath = "https://deno.land/x/manual@";
const githubBasepath = "https://raw.githubusercontent.com/denoland/manual/";
const docpath = "https://github.com/denoland/manual/blob/";
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

const SEMVER_REGEX = /v?(\d+)\.(\d+)\.(\d+)/;

// Returns true if the version is of the 0.x release line, or betwen 1.0.0 and
// 1.12.0 inclusive. During this time the manual was part of the main repo. It
// is now a seperate repo.
function isOldVersion(version: string) {
  const matches = version.match(SEMVER_REGEX);
  if (!matches) throw new TypeError("This shouldn't have happened!");
  return (
    matches[1] === "0" ||
    (matches[1] === "1" && parseInt(matches[2]) < 12) ||
    (matches[1] === "1" && matches[2] === "12" && matches[3] === "0")
  );
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

export async function getTableOfContents(
  version: string
): Promise<TableOfContents> {
  const res = await fetch(`${basepath(version)}/toc.json`);
  if (res.status !== 200) {
    throw Error(
      `Got an error (${
        res.status
      }) while getting the manual table of contents:\n${await res.text()}`
    );
  }
  return await res.json();
}

export function getFileURL(version: string, path: string): string {
  return `${basepath(version)}${path}.md`;
}

export function getDocURL(version: string, path: string): string {
  return `${docpath}${version}/docs${path}.md`;
}

export function isPreviewVersion(version: string): boolean {
  return VERSIONS.cli.find((v) => v === version) === undefined;
}
