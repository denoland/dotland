// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { RouteConfig } from "$fresh/server.ts";

export function handler(req: Request) {
  return Response.redirect(
    `https://deno.land/x/install${new URL(req.url).pathname}`,
    307,
  );
}

export const config: RouteConfig = { routeOverride: "/install(\\.sh|\\.ps1)" };
