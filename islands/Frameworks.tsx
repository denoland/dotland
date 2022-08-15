/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { css, tw } from "@twind";
import { useEffect, useState } from "preact/hooks";

export default function Frameworks() {
  return (
    <div class={tw`relative bg-ultralight mt-20`}>
      <div class={tw`w-[750px] mx-auto py-12`}>
        <hgroup class={tw`flex flex-col w-full flex items-center`}>
          <h2 class={tw`text-2xl font-semibold`}>
            How to build a website with Deno
          </h2>
          <h3 class={tw`text-gray-400 leading-none`}>
            SSR, Streaming, File-system routing, etc...
          </h3>
        </hgroup>
      </div>
    </div>
  );
}
