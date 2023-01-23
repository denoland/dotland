// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import { Handlers, RouteConfig } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    return Response.redirect("https://deno.land/posts/v1", 307);
  },
};

export const config: RouteConfig = { routeOverride: "/v1" };
