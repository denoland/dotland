import { main } from "./doc_utils";
import { readFileSync } from "fs";
import * as path from "path";

test("basic", () => {
  const rootModule = "foo.ts";
  const rootSource = "export function bar(x: string): void {  }";
  const docEntries = main(rootModule, rootSource);
  expect(docEntries).toEqual([
    {
      name: "bar",
      kind: "method",
      typestr: "(x: string): void",
      args: [{ docstr: undefined, name: "x", typestr: "string" }],
      retType: "void",
      docstr: undefined
    }
  ]);
});
