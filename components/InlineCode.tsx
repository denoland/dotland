// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import type { ComponentChildren } from "preact";

export function InlineCode(
  props: { children: ComponentChildren; id?: string },
) {
  return (
    <code
      class="py-1 px-2 font-mono bg-gray-100 text-sm break-words rounded-[6px]"
      id={props.id}
    >
      {props.children}
    </code>
  );
}
