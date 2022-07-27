// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { ComponentChildren, h } from "preact";
import { tw } from "@twind";

export function Tag(
  props: { children: ComponentChildren; color: string },
) {
  return (
    <div
      class={tw`inline py-1 px-2 rounded-full bg-tag-${props.color}-bg text-tag-${props.color} leading-none font-medium text-xs`}
    >
      {props.children}
    </div>
  );
}
