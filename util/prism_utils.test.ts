// Copyright 2022 the Deno authors. All rights reserved. MIT license.
// Taken from https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/utils/normalizeTokens.js

import { assertEquals } from "../test_deps.ts";
import { Prism } from "../deps.ts";
import { normalizeTokens } from "./prism_utils.ts";

Deno.test("prism", () => {
  assertEquals(
    normalizeTokens(Prism.tokenize(
      `
import { serve } from "https://deno.land/std/http/server.ts";

console.log("http://localhost:8000/");
serve((req) => new Response("Hello World\\n"), { port: 8000 });
`,
      Prism.languages["javascript"],
    )),
    [
      [{ types: ["plain"], content: "\n", empty: true }],
      [
        { types: ["plain"], content: "" },
        { types: ["keyword"], content: "import" },
        { types: ["plain"], content: " " },
        { types: ["punctuation"], content: "{" },
        { types: ["plain"], content: " serve " },
        { types: ["punctuation"], content: "}" },
        { types: ["plain"], content: " " },
        { types: ["keyword"], content: "from" },
        { types: ["plain"], content: " " },
        {
          types: ["string"],
          content: '"https://deno.land/std/http/server.ts"',
        },
        { types: ["punctuation"], content: ";" },
        { types: ["plain"], content: "" },
      ],
      [{ types: ["plain"], content: "\n", empty: true }],
      [
        { types: ["plain"], content: "console" },
        { types: ["punctuation"], content: "." },
        { types: ["function"], content: "log" },
        { types: ["punctuation"], content: "(" },
        { types: ["string"], content: '"http://localhost:8000/"' },
        { types: ["punctuation"], content: ")" },
        { types: ["punctuation"], content: ";" },
        { types: ["plain"], content: "" },
      ],
      [
        { types: ["plain"], content: "" },
        { types: ["function"], content: "serve" },
        { types: ["punctuation"], content: "(" },
        { types: ["punctuation"], content: "(" },
        { types: ["parameter"], content: "req" },
        { types: ["punctuation"], content: ")" },
        { types: ["plain"], content: " " },
        { types: ["operator"], content: "=>" },
        { types: ["plain"], content: " " },
        { types: ["keyword"], content: "new" },
        { types: ["plain"], content: " " },
        { types: ["class-name"], content: "Response" },
        { types: ["punctuation"], content: "(" },
        { types: ["string"], content: '"Hello World\\n"' },
        { types: ["punctuation"], content: ")" },
        { types: ["punctuation"], content: "," },
        { types: ["plain"], content: " " },
        { types: ["punctuation"], content: "{" },
        { types: ["plain"], content: " port" },
        { types: ["operator"], content: ":" },
        { types: ["plain"], content: " " },
        { types: ["number"], content: "8000" },
        { types: ["plain"], content: " " },
        { types: ["punctuation"], content: "}" },
        { types: ["punctuation"], content: ")" },
        { types: ["punctuation"], content: ";" },
        { types: ["plain"], content: "" },
      ],
      [{ types: ["plain"], content: "\n", empty: true }],
    ],
  );
});
