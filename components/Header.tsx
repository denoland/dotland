// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";

import { tw } from "@twind";
import * as Icons from "./Icons.tsx";

const entries = [
  { href: "/manual", content: "Manual" },
  {
    href: "https://doc.deno.land/deno/stable",
    content: "API",
  },
  { href: "/std", content: "Standard Library" },
  { href: "/x", content: "Third Party Modules" },
  { href: "https://deno.com/blog", content: "Blog" },
] as const;

export function Header({
  selected,
  background,
}: {
  selected?: (typeof entries)[number]["content"];
  background?: boolean;
}) {
  return (
    <div
      class={tw`px-20 py-5.5 ${
        background ? "bg-white border-b border-secondary backdrop-blur-3xl" : ""
      }`}
    >
      <nav class={tw`flex justify-between`}>
        <div class={tw`h-9 flex items-center`}>
          <a href="/">
            <img class={tw`h-8 w-auto`} src="/logo.svg" alt="" />
          </a>

          {/* TODO */}
        </div>

        <div class={tw`flex items-center font-medium`}>
          {entries.map(({ href, content }) => {
            if (content === selected) {
              // TODO (@crowlKats): fix underline
              return (
                <a
                  href={href}
                  class={tw
                    `ml-8 text-black underline underline-offset-6 decoration-2`}
                >
                  {content}
                </a>
              );
            } else {
              return (
                <a href={href} class={tw`ml-8 text-main`}>
                  {content}
                </a>
              );
            }
          })}

          <a
            href="https://deno.com/deploy"
            class={tw`h-9 ml-5 bg-secondary rounded-md px-4 flex items-center`}
          >
            Deploy
          </a>

          <a href="https://github.com/denoland" class={tw`ml-5 my-auto`}>
            <span class={tw`sr-only`}>GitHub</span>
            <Icons.GitHub class="inline" />
          </a>
        </div>
      </nav>
    </div>
  );
}
