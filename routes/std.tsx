// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h, PageConfig, PageProps } from "../deps.ts";
import { Handlers } from "../server_deps.ts";
import Registry, { handler as xHandler } from "./x/module.tsx";

export default function RegistryPage(props: PageProps) {
  props.params.name = "std";
  if (props.params.version?.startsWith("v")) {
    props.params.version = props.params.version.slice(1);
  }
  return <Registry {...props} />;
}

export const handler: Handlers = {
  GET(req, ctx) {
    ctx.params.name = "std";
    if (ctx.params.version?.startsWith("v")) {
      ctx.params.version = ctx.params.version.slice(1);
    }
    return xHandler.GET!(req, ctx);
  },
};

export const config: PageConfig = {
  routeOverride: "/std{@:version}?/:path*",
};
