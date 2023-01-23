// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import { Handlers, RouteConfig } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_, { params }) {
    return Response.redirect(`https://deno.com/blog/${params.path}`, 307);
  },
};

export const config: RouteConfig = { routeOverride: "/posts/:path*" };
