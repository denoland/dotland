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
  GET(ctx) {
    ctx.match.name = "std";
    if (ctx.match.version?.startsWith("v")) {
      ctx.match.version = ctx.match.version.slice(1);
    }
    return xHandler.GET!(ctx);
  },
};

export const config: PageConfig = {
  routeOverride: "/std{@:version}?/:path*",
};
