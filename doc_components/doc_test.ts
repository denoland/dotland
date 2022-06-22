// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { assertEquals } from "./deps_test.ts";
import { type DocNode } from "./deps.ts";
import { byKind } from "./doc.ts";

Deno.test({
  name: "doc - sort by kind",
  fn() {
    const fixtures: DocNode[] = [
      {
        name: "namespace",
        kind: "namespace",
        namespaceDef: { elements: [] },
        location: { filename: "", line: 0, col: 0 },
        declarationKind: "export",
      },
      {
        name: "fn",
        kind: "function",
        functionDef: {
          params: [],
          isAsync: false,
          isGenerator: false,
          typeParams: [],
        },
        location: { filename: "", line: 0, col: 0 },
        declarationKind: "export",
      },
      {
        name: "A",
        kind: "interface",
        interfaceDef: {
          extends: [],
          methods: [],
          properties: [],
          callSignatures: [],
          indexSignatures: [],
          typeParams: [],
        },
        location: { filename: "", line: 0, col: 0 },
        declarationKind: "export",
      },
    ];
    fixtures.sort(byKind);
    assertEquals(fixtures.map(({ kind }) => kind), [
      "namespace",
      "interface",
      "function",
    ]);
  },
});
