// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { PageConfig } from "../../deps.ts";

export function handler() {
  return Response.redirect("https://deno.land/posts/v1", 307);
}

export const config: PageConfig = { routeOverride: "/v1" };
