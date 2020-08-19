import {
  handleRequest,
  extractAltLineNumberReference,
} from "../src/handler.ts";
import {
  assertEquals,
  assertStringContains,
} from "https://deno.land/std/testing/asserts.ts";

/* Worker Proxying */
Deno.test("/ responds with React html", async () => {
  const result = await handleRequest(new Request("https://deno.land/"));
  assertStringContains(result.headers.get("Content-Type") || "", "text/html");
  const text = await result.text();
  assertStringContains(text, "Deno");
});

Deno.test("/std/version.ts with Accept: 'text/html' responds with React html", async () => {
  const result = await handleRequest(
    new Request("https://deno.land/std/version.ts", {
      headers: { Accept: "text/html" },
    }),
  );
  assertStringContains(result.headers.get("Content-Type") || "", "text/html");
  const text = await result.text();
  assertStringContains(text, "Deno");
});

Deno.test("/x/std/version.ts with Accept: 'text/html' responds with React html", async () => {
  const result = await handleRequest(
    new Request("https://deno.land/x/std/version.ts", {
      headers: { Accept: "text/html" },
    }),
  );
  assertStringContains(result.headers.get("Content-Type") || "", "text/html");
  const text = await result.text();
  assertStringContains(text, "Deno");
});

Deno.test("/x/std/version.ts with no Accept responds with redirect", async () => {
  const result = await handleRequest(
    new Request("https://deno.land/x/std/version.ts"),
  );
  assertEquals(result.status, 302);
  assertStringContains(result.headers.get("Location") || "", "@");
  assertStringContains(result.headers.get("X-Deno-Warning") || "", "latest");
  assertStringContains(
    result.headers.get("X-Deno-Warning") || "",
    "/std/version.ts",
  );
});

Deno.test("/std@v0.50.0/version.ts with Accept: 'text/html' responds with React html", async () => {
  const result = await handleRequest(
    new Request("https://deno.land/std@0.50.0/version.ts", {
      headers: { Accept: "text/html" },
    }),
  );
  assertStringContains(result.headers.get("Content-Type") || "", "text/html");
  const text = await result.text();
  assertStringContains(text, "Deno");
});

Deno.test("/std@v0.50.0/version.ts with no Accept responds with raw typescript", async () => {
  const result = await handleRequest(
    new Request("https://deno.land/std@0.50.0/version.ts"),
  );
  assertStringContains(
    result.headers.get("Content-Type") || "",
    "application/typescript",
  );
  const text = await result.text();
  assertStringContains(text, "/** Version of the Deno standard modules");
});

Deno.test("/x/std@0.50.0/version.ts with Accept: 'text/html' responds with React html", async () => {
  const result = await handleRequest(
    new Request("https://deno.land/x/std@0.50.0/version.ts", {
      headers: { Accept: "text/html" },
    }),
  );
  assertStringContains(result.headers.get("Content-Type") || "", "text/html");
  const text = await result.text();
  assertStringContains(text, "Deno");
});

Deno.test("/x/std@v0.50.0/version.ts with no Accept responds with raw typescript", async () => {
  const result = await handleRequest(
    new Request("https://deno.land/x/std@0.50.0/version.ts"),
  );
  assertStringContains(
    result.headers.get("Content-Type") || "",
    "application/typescript",
  );
  const text = await result.text();
  assertStringContains(text, "/** Version of the Deno standard modules");
});

Deno.test("/std/fs/mod.ts:5:3 with Accept: 'text/html' responds with line number redirect", async () => {
  const result = await handleRequest(
    new Request("https://deno.land/std/fs/mod.ts:5:3", {
      headers: { Accept: "text/html" },
    }),
  );
  assertEquals(result.status, 302);
  assertStringContains(
    result.headers.get("Location") || "",
    "/std/fs/mod.ts#L5",
  );
});

Deno.test("/std@0.50.0/fs/mod.ts:5:3 with Accept: 'text/html' responds with line number redirect", async () => {
  const result = await handleRequest(
    new Request("https://deno.land/std@0.50.0/fs/mod.ts:5:3", {
      headers: { Accept: "text/html" },
    }),
  );
  assertEquals(result.status, 302);
  assertStringContains(
    result.headers.get("Location") || "",
    "/std@0.50.0/fs/mod.ts#L5",
  );
});

Deno.test("/x/std/fs/mod.ts:5:3 with Accept: 'text/html' responds with line number redirect", async () => {
  const result = await handleRequest(
    new Request("https://deno.land/x/std/fs/mod.ts:5:3", {
      headers: { Accept: "text/html" },
    }),
  );
  assertEquals(result.status, 302);
  assertStringContains(
    result.headers.get("Location") || "",
    "/x/std/fs/mod.ts#L5",
  );
});

Deno.test("/x/std@0.50.0/fs/mod.ts:5:3 with Accept: 'text/html' responds with line number redirect", async () => {
  const result = await handleRequest(
    new Request("https://deno.land/x/std@0.50.0/fs/mod.ts:5:3", {
      headers: { Accept: "text/html" },
    }),
  );
  assertEquals(result.status, 302);
  assertStringContains(
    result.headers.get("Location") || "",
    "/x/std@0.50.0/fs/mod.ts#L5",
  );
});

/* End Worker Proxying */

/* Unit tests */
Deno.test("extractAltLineNumberReference", () => {
  assertEquals(
    extractAltLineNumberReference("https://deno.land/x/std/fs/mod.ts:5:3"),
    {
      rest: "https://deno.land/x/std/fs/mod.ts",
      line: 5,
    },
  );
  assertEquals(
    extractAltLineNumberReference(
      "https://deno.land/x/std@0.50.0/fs/mod:ts:5:3",
    ),
    {
      rest: "https://deno.land/x/std@0.50.0/fs/mod:ts",
      line: 5,
    },
  );
  assertEquals(
    extractAltLineNumberReference(
      "https://deno.land/x/std@0.50.0/fs/mod.ts:a:3",
    ),
    null,
  );
  assertEquals(
    extractAltLineNumberReference(
      "https://deno.land/x/std@0.50.0/fs/mod.ts:5:a",
    ),
    null,
  );
  assertEquals(
    extractAltLineNumberReference(
      "https://deno.land/x/std@0.50.0/fs/mod.ts:a:a",
    ),
    null,
  );
  assertEquals(
    extractAltLineNumberReference("https://deno.land/x/std@0.50.0/fs/mod.ts"),
    null,
  );
});
/* End Unit Tests */
