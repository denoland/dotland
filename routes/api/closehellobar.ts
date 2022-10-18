// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  POST(req) {
    const url = new URL(req.url);
    const to = url.searchParams.get("to");
    if (!to) {
      return new Response("Missing 'to' query parameter", { status: 400 });
    }
    const headers = new Headers();
    setCookie(headers, {
      name: "hellobar",
      value: to,
      sameSite: "Lax",
      domain: url.hostname,
      path: "/",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
    });
    return new Response("", { headers });
  },
};
