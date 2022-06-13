// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { ComponentChildren, h } from "$fresh/runtime.ts";
import { tw } from "twind";

export function HelloBar(props: {
  to: string;
  children: ComponentChildren;
}) {
  return (
    <div class={tw`text-center bg-black text-white`}>
      <span class={tw`float-left cursor-pointer py-2 pl-4`} onclick="this.closest('div').remove();">✕</span>
      <a href={props.to} target="_blank" class={tw`h-full w-full block p-2`}>
        {props.children}
      </a>
    </div>
  );
}
