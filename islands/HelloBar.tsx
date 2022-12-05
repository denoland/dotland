// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Cross } from "@/components/Icons.tsx";

export default function HelloBar(props: {
  to: string;
  children: ComponentChildren;
}) {
  const [open, setOpen] = useState(true);
  return open
    ? (
      <div class="text-center bg-default text-mainBlue py-1 px-2 gap-1 flex items-center justify-between">
        <div class="flex-grow text-center">
          <a
            href={props.to}
            target="_blank"
            class="inline-block font-semibold p-1 hover:text-underline"
          >
            {props.children}
          </a>
        </div>
        <button
          disabled={!IS_BROWSER}
          onClick={() => {
            setOpen(false);
            const url = new URL("/api/closehellobar", location.href);
            url.searchParams.set("to", props.to);
            fetch(url.href, { method: "POST", credentials: "same-origin" })
              .catch(() => {});
          }}
        >
          <Cross />
        </button>
      </div>
    )
    : <div></div>;
}
