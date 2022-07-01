// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { ComponentChildren, h } from "preact";
import { tw } from "@twind";

export function HelloBar(props: {
  to: string;
  children: ComponentChildren;
}) {
  return (
    <div class={tw`text-center bg-black text-white p-1`}>
      <a
        href={props.to}
        target="_blank"
        class={tw`inline-block p-1 hover:text-underline`}
      >
        {props.children}
      </a>
    </div>
  );
}
