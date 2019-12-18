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

test("multiple declarations", () => {
  const rootModule = "http_exception.ts";

  // copy from `https://deno.land/x/abc/http_exception.ts`
  const rootSource = `
    export function createHttpExceptionBody(
      message: string,
      error?: string,
      statusCode?: number
    ): HttpExceptionBody;
    export function createHttpExceptionBody<T extends Record<string, any>>(
      body: T
    ): T;
    export function createHttpExceptionBody<T extends Record<string, any>>(
      msgOrBody: string | T,
      error?: string,
      statusCode?: number
    ): HttpExceptionBody | T {
      if (typeof msgOrBody === "object" && !Array.isArray(msgOrBody)) {
        return msgOrBody;
      } else if (typeof msgOrBody === "string") {
        return { statusCode, error, message: msgOrBody };
      }
      return { statusCode, error };
    }
  `;
  const docEntries = main(rootModule, rootSource);
  expect(docEntries).toEqual([
    {
      name: "createHttpExceptionBody",
      kind: "method",
      typestr: "(message: string, error?: string, statusCode?: number): any",
      args: [
        {
          docstr: undefined,
          name: "message",
          typestr: "string"
        },
        {
          docstr: undefined,
          name: "error",
          typestr: "string"
        },
        {
          docstr: undefined,
          name: "statusCode",
          typestr: "number"
        }
      ],
      retType: "any",
      docstr: undefined
    },
    {
      name: "createHttpExceptionBody",
      kind: "method",
      typestr: "<T extends any>(body: T): T",
      args: [
        {
          docstr: undefined,
          name: "body",
          typestr: "T"
        }
      ],
      retType: "T",
      docstr: undefined
    },
    {
      name: "createHttpExceptionBody",
      kind: "method",
      typestr:
        "<T extends any>(msgOrBody: string | T, error?: string, statusCode?: number): any",
      args: [
        {
          docstr: undefined,
          name: "msgOrBody",
          typestr: "string | T"
        },
        {
          docstr: undefined,
          name: "error",
          typestr: "string"
        },
        {
          docstr: undefined,
          name: "statusCode",
          typestr: "number"
        }
      ],
      retType: "any",
      docstr: undefined
    }
  ]);
});
