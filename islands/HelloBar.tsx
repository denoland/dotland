// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { ComponentChildren, h } from "preact";
import { useState } from "preact/hooks";
import { tw } from "@twind";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Cross } from "@/components/Icons.tsx";

export default function HelloBar(props: {
  to: string;
  children: ComponentChildren;
}) {
  const [open, setOpen] = useState(true);
  return open
    ? (
      <div
        class={tw`text-center bg-black text-white p-1 flex items-center justify-between flex-wrap`}
      >
        <div class={tw`flex-grow text-center`}>
          <a
            href={props.to}
            target="_blank"
            class={tw`inline-block p-1 hover:text-underline`}
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
