/* Copyright 2022 the Deno authors. All rights reserved. MIT license. */

/** @jsx h */
import { h } from "../deps.ts";

export function InlineCode(props: { children: React.ReactNode }) { // TODO
  return (
    <code className="py-1 px-2 font-mono bg-gray-100 text-sm break-all">
      {props.children}
    </code>
  );
}
