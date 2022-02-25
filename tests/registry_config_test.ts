// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { assertEquals } from "../test_deps.ts";

import { ServerContext } from "../server_deps.ts";
import routes from "../routes.gen.ts";
const handleRequest = (await ServerContext.fromRoutes(routes)).handler();

Deno.test({
  name: "handleConfigRequest - v1 version of manifest",
  async fn() {
    const res = await handleRequest(
      new Request(
        "https://deno.land/.well-known/deno-import-intellisense.json",
        { headers: { "accept": "*/*" } },
      ),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.version, 1);
  },
});

Deno.test({
  name: "handleConfigRequest - browser",
  async fn() {
    const res = await handleRequest(
      new Request(
        "https://deno.land/.well-known/deno-import-intellisense.json",
        {
          headers: {
            "accept":
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          },
        },
      ),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.version, 2);
  },
});

Deno.test({
  name: "handleConfigRequest - v2 version of manifest",
  async fn() {
    const res = await handleRequest(
      new Request(
        "https://deno.land/.well-known/deno-import-intellisense.json",
        {
          headers: {
            // this is the accept header Deno v 1.17.1 and later sends in the request
            accept:
              "application/vnd.deno.reg.v2+json, application/vnd.deno.reg.v1+json;q=0.9, application/json;q=0.8",
          },
        },
      ),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.version, 2);
  },
});
