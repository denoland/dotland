import { type Handlers, type RouteConfig } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req, { params }) {
    const url = new URL(req.url);

    const shieldsUrl = new URL("https://img.shields.io/endpoint");
    shieldsUrl.search = url.search;
    shieldsUrl.searchParams.set(
      "url",
      `https://apiland.deno.dev/shields/${params.name}/${params.kind}`,
    );

    return fetch(shieldsUrl);
  },
};

export const config: RouteConfig = {
  routeOverride: "/badge/:name/:kind(version|popularity)",
};
