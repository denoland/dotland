// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { type ComponentChildren } from "preact";
import * as Icons from "./Icons.tsx";

export function ErrorMessage(props: {
  title: string;
  children: ComponentChildren;
}) {
  return (
    <div class="rounded-md bg-red-50 border border-red-200 p-4 w-full">
      <div class="flex gap-3">
        <Icons.StatusError />
        <div>
          <h3 class="text-sm leading-5 font-medium text-red-800">
            {props.title}
          </h3>
          <div class="mt-2 text-sm leading-5 text-red-700">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}
