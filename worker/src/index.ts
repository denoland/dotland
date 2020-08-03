/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { handleRequest } from "./handler";

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});
