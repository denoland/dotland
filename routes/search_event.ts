// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import { type Handlers, type RouteConfig } from "$fresh/server.ts";
import {
  DOTLAND_EVENTS_ENDPOINT,
  getUserToken,
  searchClick,
} from "@/util/search_insights_utils.ts";

function assert(cond: unknown, msg = "Assertion failed"): asserts cond {
  if (!cond) {
    throw new Error(msg);
  }
}

export const handler: Handlers = {
  async POST(req, ctx) {
    assert(ctx.remoteAddr.transport === "tcp");
    const userToken = await getUserToken(req.headers, ctx.remoteAddr.hostname);
    searchClick(userToken, await req.json());
    return new Response(`{"status":200,"statusText":"OK"}`, {
      status: 200,
      statusText: "OK",
      headers: { "content-type": "application/json" },
    });
  },
};

export const config: RouteConfig = { routeOverride: DOTLAND_EVENTS_ENDPOINT };
