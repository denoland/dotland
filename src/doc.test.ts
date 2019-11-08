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

test("enum", () => {
  const rootModule = "http_status.ts";
  const rootSource = `
    /** HTTP status codes */
    export enum Status {
      /** RFC 7231, 6.2.1 */
      Continue = 100,
      SwitchingProtocols = 101, // RFC 7231, 6.2.2
      Processing = 102 // RFC 2518, 10.1
    };
  `;
  const docEntries = main(rootModule, rootSource);
  expect(docEntries).toEqual([
    {
      name: "Status",
      kind: "enum",
      docstr: "HTTP status codes"
    },
    {
      name: "Status.Continue",
      kind: "enumMember",
      docstr: "RFC 7231, 6.2.1",
      typestr: "100"
    },
    {
      name: "Status.SwitchingProtocols",
      kind: "enumMember",
      typestr: "101"
    },
    {
      name: "Status.Processing",
      kind: "enumMember",
      typestr: "102"
    }
  ]);
});
