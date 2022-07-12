// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { ComponentChildren, h } from "preact";
import { tw } from "@twind";

export function InlineCode(
  props: { children: ComponentChildren; id?: string },
) {
  return (
    <code
      class={tw
        `py-1 px-2 font-mono bg-gray-100 text-sm break-words rounded-[6px]`}
      id={props.id}
    >
      {props.children}
    </code>
  );
}
