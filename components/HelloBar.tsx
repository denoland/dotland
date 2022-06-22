// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { ComponentChildren, h } from "preact";
import { tw } from "@twind";

export function HelloBar(props: {
  to: string;
  children: ComponentChildren;
}) {
  return (
    <div class={tw`text-center bg-black text-white`}>
      <a href={props.to} target="_blank" class={tw`h-full w-full block p-2`}>
        {props.children}
      </a>
    </div>
  );
}
