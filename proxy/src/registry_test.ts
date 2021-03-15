import { assertEquals } from "../test_deps.ts";
import { extractAltLineNumberReference } from "./registry.ts";

Deno.test("extractAltLineNumberReference", () => {
  assertEquals(extractAltLineNumberReference("/x/std/fs/mod.ts:5:3"), {
    rest: "/x/std/fs/mod.ts",
    line: 5,
  });
  assertEquals(extractAltLineNumberReference("/x/std@0.50.0/fs/mod:ts:5:3"), {
    rest: "/x/std@0.50.0/fs/mod:ts",
    line: 5,
  });
  assertEquals(
    extractAltLineNumberReference("/x/std@0.50.0/fs/mod.ts:a:3"),
    null,
  );
  assertEquals(
    extractAltLineNumberReference("/x/std@0.50.0/fs/mod.ts:5:a"),
    null,
  );
  assertEquals(
    extractAltLineNumberReference("/x/std@0.50.0/fs/mod.ts:a:a"),
    null,
  );
  assertEquals(
    extractAltLineNumberReference("/x/std@0.50.0/fs/mod.ts"),
    null,
  );
});
