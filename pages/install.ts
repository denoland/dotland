// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { PageConfig } from "../deps.ts";
import { HandlerContext } from "../server_deps.ts";

export function handler({ req }: HandlerContext) {
  return Response.redirect(
    `https://deno.land/x/install${new URL(req.url).pathname}`,
    307,
  );
}

export const config: PageConfig = {
  routeOverride: "/install(\\.sh|\\.ps1)",
};
