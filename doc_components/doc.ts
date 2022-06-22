// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** Utilities for dealing with deno_doc structures and their derivatives.
 *
 * @module
 */

import { type DocNode, type DocNodeClass, type DocNodeKind } from "./deps.ts";

const EXT = [".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"];
const INDEX_MODULES = ["mod", "lib", "main", "index"].flatMap((idx) =>
  EXT.map((ext) => `${idx}${ext}`)
);

const KIND_ORDER: DocNodeKind[] = [
  "namespace",
  "class",
  "interface",
  "typeAlias",
  "variable",
  "function",
  "enum",
  "moduleDoc",
  "import",
];

export function byKind(a: DocNode, b: DocNode): number {
  return KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind);
}

export function byKindValue(a: DocNodeKind, b: DocNodeKind): number {
  return KIND_ORDER.indexOf(a) - KIND_ORDER.indexOf(b);
}

/** If a doc node has JSDoc, return the first paragraph of the JSDoc doc. */
export function getDocSummary(docNode: DocNode): string | undefined {
  if (docNode.jsDoc?.doc) {
    const [summary] = docNode.jsDoc.doc.split("\n\n");
    return summary;
  }
}

export function isAbstract(node: DocNode): node is DocNodeClass {
  if (node.kind === "class") {
    return node.classDef.isAbstract;
  } else {
    return false;
  }
}

export function isDeprecated(node: DocNode): boolean {
  if (node.jsDoc && node.jsDoc.tags) {
    return !!node.jsDoc.tags.find(({ kind }) => kind === "deprecated");
  }
  return false;
}

/** Given a set of paths which are expected to be siblings within a folder/dir
 * return what appears to be the "index" module. If none can be identified,
 * `undefined` is returned. */
export function getIndex(paths: string[]): string | undefined {
  for (const index of INDEX_MODULES) {
    const item = paths.find((file) => file.toLowerCase().endsWith(`/${index}`));
    if (item) {
      return item;
    }
  }
}

/** Given a record where the key is a folder and the value is an array of
 * sibling modules, return a combined array of all the module paths that should
 * be loaded for documentation. */
export function getPaths(index: Record<string, string[]>): string[] {
  let paths: string[] = [];
  for (const values of Object.values(index)) {
    const index = getIndex(values);
    if (index) {
      paths.push(index);
    } else {
      paths = paths.concat(values);
    }
  }
  return paths;
}
