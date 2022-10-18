// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";
import { PageProps, RouteConfig } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import Registry, { handler as xHandler } from "./x/module.tsx";

export default function RegistryPage(props: PageProps) {
  props.params.name = "std";
  if (props.params.version?.startsWith("v")) {
    props.params.version = props.params.version.slice(1);
  }
  return <Registry {...props} />;
}

export const handler: Handlers<unknown> = {
  GET(req, ctx) {
    ctx.params.name = "std";
    if (ctx.params.version?.startsWith("v")) {
      ctx.params.version = ctx.params.version.slice(1);
    }
    return xHandler.GET!(req, ctx);
  },
};

export const config: RouteConfig = { routeOverride: "/std{@:version}?/:path*" };
