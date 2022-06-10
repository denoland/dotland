// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { RouteConfig } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    return Response.redirect("https://deno.land/posts/v1", 307);
  },
};

export const config: RouteConfig = { routeOverride: "/v1" };
