/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { handleRequest, withLog } from "./handler.ts";

const handler = withLog(handleRequest);

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handler(event.request));
});
