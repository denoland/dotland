// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h, tw, ComponentChildren } from "../deps.ts";

export function HelloBar(props: {
  children: ComponentChildren;
}) {
  return (
    <div class={tw`text-center bg-black text-white py-2`}>
      {props.children}
    </div>
  );
}
