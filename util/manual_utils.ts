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

export async function getTableOfContents(
  version: string
): Promise<TableOfContents> {
  console.log("目前中文文档只有最新版");
  version = "master";
  const res = await fetch(`${githubBasepath}${version}/toc.json`);
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
  version = "master";
  return `${githubBasepath}${version}${path}.md`;
}

export function getDocURL(version: string, path: string): string {
  version = "master";
  return `${docpath}${version}${path}.md`;
}
