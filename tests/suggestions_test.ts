// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import {
  assert,
  assertArrayIncludes,
  assertEquals,
  assertStringIncludes,
} from "$std/testing/asserts.ts";
import { ServerContext } from "$fresh/server.ts";
import { router } from "$router";

import manifest from "@/fresh.gen.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "../twind.config.ts";
import { routes as completionsV2Routes } from "@/completions_v2.ts";

const serverCtx = await ServerContext.fromManifest(manifest, {
  plugins: [twindPlugin(twindConfig)],
});
const handler = router(completionsV2Routes, serverCtx.handler());
const handleRequest = (req: Request) =>
  handler(req, {
    localAddr: {
      transport: "tcp",
      hostname: "127.0.0.1",
      port: 80,
    },
    remoteAddr: {
      transport: "tcp",
      hostname: "127.0.0.1",
      port: 80,
    },
  });

Deno.test({
  name: "/_api/x/ - get package list",
  async fn() {
    const res = await handleRequest(new Request("https://deno.land/_api/x/"));
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.items.length, 50);
    assert(json.isIncomplete);
  },
});

Deno.test({
  name: "/_api/x/oak - package searching",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/_api/x/oak"),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.items.length, 100);
    assertEquals(json.items[0], "oak");
    assert(json.isIncomplete);
    assertEquals(json.preselect, "oak");
  },
});

Deno.test({
  name: "/_api/details/x/oak - package details",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/_api/details/x/oak"),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.kind, "markdown");
    assert(json.value.startsWith("**oak**\n\n"));
    assertStringIncludes(json.value, "[code](https://deno.land/x/oak)");
  },
});

Deno.test({
  name: "/_api/x/oak/ - versions, non-filtered",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/_api/x/oak/"),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.items[0], json.preselect);
    assertArrayIncludes(json.items, ["v10.0.0", "v10.1.0"]);
  },
});

Deno.test({
  name: "/_api/x/oak/v9. - versions, filtered",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/_api/x/oak/v9."),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.preselect, undefined);
    assertArrayIncludes(json.items, ["v9.0.1", "v9.0.0"]);
  },
});

Deno.test({
  name: "/_api/details/x/oak/v10.0.0 - version details",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/_api/details/x/oak/v10.0.0"),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.kind, "markdown");
    assert(json.value.startsWith("**oak @ v10.0.0**\n\n"));
    assertStringIncludes(json.value, "[code](https://deno.land/x/oak@v10.0.0)");
  },
});

Deno.test({
  name: "/_api/x/oak/_latest/ - latest paths",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/_api/x/oak/_latest/"),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.preselect, "mod.ts");
    assertArrayIncludes(json.items, ["examples/", "mod.ts"]);
    assert(json.isIncomplete);
  },
});

Deno.test({
  name: "/_api/x/oak/_latest/examples/ - latest paths filtered",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/_api/x/oak/_latest/examples/"),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    for (const item of json.items) {
      assert(item.startsWith("examples/"));
    }
  },
});

Deno.test({
  name: "/_api/details/x/oak/v10.0.0/mod.ts - details for path",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/_api/details/x/oak/v10.0.0/mod.ts"),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(
      json.value,
      "[docs](https://doc.deno.land/https://deno.land/x/oak@v10.0.0/mod.ts) | [code](https://deno.land/x/oak@v10.0.0/mod.ts) | size: 2.21 kB\n",
    );
  },
});

Deno.test({
  name: "/_api/details/std/0.119.0 - std version details",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/_api/details/std/0.119.0"),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    assert(json.value.startsWith(
      "**Deno `std` library @ 0.119.0**\n\nA collection of modules to assist with common tasks in Deno.\n\n[code](https://deno.land/std@0.119.0) | published: ",
    ));
  },
});

Deno.test({
  name: "/_api/details/std/0.119.0/testing/ - std path details",
  async fn() {
    const res = await handleRequest(
      new Request("https://deno.land/_api/details/std/0.119.0/testing/"),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(
      json.value,
      "**testing**\n\nUtilities for making testing easier and consistent in Deno\n\n[code](https://deno.land/std@0.119.0/testing) | size: 110 kB",
    );
  },
});
