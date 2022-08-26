// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { ComponentChildren, h } from "preact";
import { tw } from "@twind";
import * as Icons from "./Icons.tsx";

export function ErrorMessage(props: {
  title: string;
  children: ComponentChildren;
}) {
  return (
    <div class={tw`rounded-md bg-red-50 border border-red-200 p-4 w-full`}>
      <div class={tw`flex gap-3`}>
        <Icons.StatusError />
        <div>
          <h3 class={tw`text-sm leading-5 font-medium text-red-800`}>
            {props.title}
          </h3>
          <div class={tw`mt-2 text-sm leading-5 text-red-700`}>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}
