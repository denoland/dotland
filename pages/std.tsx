/* Copyright 2022 the Deno authors. All rights reserved. MIT license. */

/** @jsx h */
import { h, PageConfig, PageProps } from "../deps.ts";
import Registry from "./x/[...rest].tsx";

export default function RegistryPage(props: PageProps) {
  return <Registry {...props} />;
}

export const config: PageConfig = {
  routeOverride: "/std{@:ver}?/*",
};
