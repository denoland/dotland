// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { PageConfig } from "../../deps.ts";
import { HandlerContext } from "../../server_deps.ts";

export function handler(_, { params }: HandlerContext) {
  return Response.redirect(`https://deno.com/blog/${params.path}`, 307);
}

export const config: PageConfig = { routeOverride: "/posts/:path*" };
