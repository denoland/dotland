// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { RouteConfig } from "$fresh/server.ts";

export function handler(_req: Request) {
  return new Response(
    "The v1 registry completions API is not supported anymore. Please upgrade to Deno v1.17.1 or later.",
    { status: 404 },
  );
}

export const config: RouteConfig = {
  routeOverride: "/_vsc/*",
};
