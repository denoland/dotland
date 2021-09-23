/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { handleRequest, withLog } from "./handler.ts";

const handler = withLog(handleRequest);

addEventListener("fetch", async (event: FetchEvent) => {
  try {
    await event.respondWith(handler(event.request));
  } catch (e) {
    console.log(e);
  }
});
