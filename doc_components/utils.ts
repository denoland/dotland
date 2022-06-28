// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import {
  type DocNode,
  type DocNodeClass,
  type DocNodeEnum,
  type DocNodeFunction,
  type DocNodeImport,
  type DocNodeInterface,
  type DocNodeModuleDoc,
  type DocNodeNamespace,
  type DocNodeTypeAlias,
  type DocNodeVariable,
} from "./deps.ts";

/** Some JSX libraries (notably nano-jsx) have strange handling of the
 * child element and don't have good typings when creating a functional
 * component. This type and the function {@linkcode take} abstract this
 * away. */
export type Child<T> = T | [T];

export interface DocNodeCollection {
  moduleDoc?: DocNodeTupleArray<DocNodeModuleDoc>;
  import?: DocNodeTupleArray<DocNodeImport>;
  namespace?: DocNodeTupleArray<DocNodeNamespace>;
  class?: DocNodeTupleArray<DocNodeClass>;
  enum?: DocNodeTupleArray<DocNodeEnum>;
  variable?: DocNodeTupleArray<DocNodeVariable>;
  function?: DocNodeTupleArray<DocNodeFunction>;
  interface?: DocNodeTupleArray<DocNodeInterface>;
  typeAlias?: DocNodeTupleArray<DocNodeTypeAlias>;
}

export type DocNodeTupleArray<N extends DocNode> = [label: string, node: N][];

interface ParsedURL {
  registry: string;
  org?: string;
  package?: string;
  version?: string;
  module?: string;
}

function appendCollection(
  collection: DocNodeCollection,
  nodes: DocNode[],
  path?: string,
  includePrivate = false,
) {
  for (const node of nodes) {
    if (includePrivate || node.declarationKind !== "private") {
      if (node.kind === "namespace" && !node.namespaceDef.elements.length) {
        continue;
      }
      if (node.kind === "moduleDoc" && path) {
        continue;
      }
      const docNodes: DocNodeTupleArray<DocNode> = collection[node.kind] ??
        (collection[node.kind] = []);
      const label = path ? `${path}.${node.name}` : node.name;
      docNodes.push([label, node]);
      if (node.kind === "namespace") {
        appendCollection(
          collection,
          node.namespaceDef.elements,
          label,
          includePrivate,
        );
      }
    }
  }
}

export function asCollection(
  nodes: DocNode[],
  path?: string,
  includePrivate = false,
): DocNodeCollection {
  const collection: DocNodeCollection = {};
  appendCollection(collection, nodes, path, includePrivate);
  return collection;
}

export function assert(
  cond: unknown,
  message = "Assertion error",
): asserts cond {
  if (!cond) {
    throw new Error(message);
  }
}

export function byName<Node extends DocNode>(
  a: [label: string, node: Node],
  b: [label: string, node: Node],
) {
  return a[0].localeCompare(b[0]);
}

/** Convert a string into a camelCased string. */
export function camelize(str: string): string {
  return str.split(/[\s_\-]+/).map((word, index) =>
    index === 0
      ? word.toLowerCase()
      : `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
  ).join("");
}

export function isAbstract(node: DocNode) {
  if (node.kind === "class") {
    return node.classDef.isAbstract;
  }
  return false;
}

export function isDeprecated(node: DocNode) {
  if (node.jsDoc && node.jsDoc.tags) {
    return node.jsDoc.tags.some(({ kind }) => kind === "deprecated");
  }
}

/** If the condition is true, return the `isTrue` value, other return `isFalse`
 * which defaults to `undefined`. */
export function maybe<T>(cond: unknown, isTrue: T): T | null;
/** If the condition is true, return the `isTrue` value, other return `isFalse`
 * which defaults to `undefined`. */
export function maybe<T, F>(cond: unknown, isTrue: T, isFalse: F): T | F;
/** If the condition is true, return the `isTrue` value, other return `isFalse`
 * which defaults to `undefined`. */
export function maybe<T, F>(
  cond: unknown,
  isTrue: T,
  isFalse?: F,
): T | F | null {
  return cond ? isTrue : isFalse ?? null;
}

/** Patterns of "registries" which will be parsed to be displayed in a more
 * human readable way. */
const patterns = {
  "deno.land/x": [
    new URLPattern(
      "https://deno.land/x/:pkg([^@/]+){@}?:ver?/:mod*",
    ),
  ],
  "deno.land/std": [new URLPattern("https://deno.land/std{@}?:ver?/:mod*")],
  "nest.land": [new URLPattern("https://x.nest.land/:pkg([^@/]+)@:ver/:mod*")],
  "crux.land": [new URLPattern("https://crux.land/:pkg([^@/]+)@:ver")],
  "github.com": [
    new URLPattern(
      "https://raw.githubusercontent.com/:org/:pkg/:ver/:mod*",
    ),
    // https://github.com/denoland/deno_std/raw/main/http/mod.ts
    new URLPattern(
      "https://github.com/:org/:pkg/raw/:ver/:mod*",
    ),
  ],
  "gist.github.com": [
    new URLPattern(
      "https://gist.githubusercontent.com/:org/:pkg/raw/:ver/:mod*",
    ),
  ],
  "esm.sh": [
    new URLPattern(
      "http{s}?://esm.sh/:org(@[^/]+)?/:pkg([^@/]+){@}?:ver?/:mod?",
    ),
    // https://cdn.esm.sh/v58/firebase@9.4.1/database/dist/database/index.d.ts
    new URLPattern(
      "http{s}?://cdn.esm.sh/:regver*/:org(@[^/]+)?/:pkg([^@/]+)@:ver/:mod*",
    ),
  ],
  "skypack.dev": [
    new URLPattern({
      protocol: "https",
      hostname: "cdn.skypack.dev",
      pathname: "/:org(@[^/]+)?/:pkg([^@/]+){@}?:ver?/:mod?",
      search: "*",
    }),
    // https://cdn.skypack.dev/-/@firebase/firestore@v3.4.3-A3UEhS17OZ2Vgra7HCZF/dist=es2019,mode=types/dist/index.d.ts
    new URLPattern(
      "https://cdn.skypack.dev/-/:org(@[^/]+)?/:pkg([^@/]+)@:ver([^-]+):hash/:path*",
    ),
  ],
  "unpkg.com": [
    new URLPattern(
      "https://unpkg.com/:org(@[^/]+)?/:pkg([^@/]+){@}?:ver?/:mod?",
    ),
  ],
};

/** Take a string URL and attempt to pattern match it against a known registry
 * and returned the parsed structure. */
export function parseURL(url: string): ParsedURL | undefined {
  for (const [registry, pattern] of Object.entries(patterns)) {
    for (const pat of pattern) {
      const match = pat.exec(url);
      if (match) {
        let { pathname: { groups: { regver, org, pkg, ver, mod } } } = match;
        if (registry === "gist.github.com") {
          pkg = pkg.substring(0, 7);
          ver = ver.substring(0, 7);
        }
        return {
          registry: regver ? `${registry} @ ${regver}` : registry,
          org: org || undefined,
          package: pkg || undefined,
          version: ver || undefined,
          module: mod || undefined,
        };
      }
    }
  }
}

/** A utility function that inspects a value, and if the value is an array,
 * returns the first element of the array, otherwise returns the value. This is
 * used to deal with the ambiguity around children properties with nano_jsx. */
export function take<T>(
  value: Child<T>,
  itemIsArray = false,
  isArrayOfArrays = false,
): T {
  if (itemIsArray) {
    if (isArrayOfArrays) {
      return Array.isArray(value) && Array.isArray(value[0]) &&
          Array.isArray(value[0][0])
        ? value[0]
        : value as T;
    } else {
      return Array.isArray(value) && Array.isArray(value[0])
        ? value[0]
        : value as T;
    }
  } else {
    return Array.isArray(value) ? value[0] : value;
  }
}
