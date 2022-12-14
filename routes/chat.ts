// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { type Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    return Response.redirect("https://discord.gg/deno", 302);
  },
};
