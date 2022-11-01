// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { apply, tw } from "twind";
import { css } from "twind/css";
import * as Icons from "./Icons.tsx";
import GlobalSearch from "@/islands/GlobalSearch.tsx";
import versions from "@/versions.json" assert { type: "json" };

const entries = [
  {
    content: "Modules",
    children: [
      { href: "/std", content: "Standard Library" },
      { href: "/x", content: "Third Party Modules" },
    ],
  },
  {
    content: "Docs",
    children: [
      { href: "/manual", content: "Manual" },
      { href: "/api", content: "API" },
    ],
  },
  { href: "https://deno.com/deploy", content: "Deploy" },
];

type ContentTypes = (typeof entries)[number]["content"];

export function Header({ selected, manual }: {
  selected?: ContentTypes;
  manual?: boolean;
}) {
  return (
    <div class={`${manual ? "lg:border-b" : "border-b"} border-border`}>
      <div class="section-x-inset-2xl py-5 h-full">
        <nav class="flex justify-between flex-col lg:flex-row h-full">
          <input
            type="checkbox"
            id="menuToggle"
            class="hidden checked:siblings:flex checked:sibling:children:last-child:children:(first-child:hidden last-child:block)"
            autoComplete="off"
          />

          <div class="h-9 flex flex-1 items-center justify-between lg:justify-start select-none w-full lg:w-min gap-3 md:gap-6 lg:gap-8">
            <a href="/" class="flex items-center flex-none gap-4">
              <Icons.Logo class="h-8 flex-none" />
              <Icons.Deno class="h-6 flex-none" />
            </a>

            <label
              tabIndex={0}
              class={tw`cursor-pointer lg:hidden ${
                css({
                  "touch-action": "manipulation",
                })
              }`}
              for="menuToggle"
              // @ts-ignore onKeyDown does support strings
              onKeyDown="if (event.code === 'Space' || event.code === 'Enter') { this.click(); event.preventDefault(); }"
            >
              <Icons.Menu />
              <Icons.Cross class="hidden" />
            </label>
          </div>

          <div class="hidden flex-col mx-2 mt-5 gap-x-5 gap-y-4 font-medium lg:(flex flex-row items-center mx-0 mt-0)">
            <div class="space-x-3.5 select-none">
              {entries.map(({ href, content, children }) => (
                <div
                  class={`inline-block leading-loose children:first-child:(block px-2 rounded-t-md ${
                    !children ? "rounded-b-md" : ""
                  }) hover:children:(bg-grayDefault even:block) text-gray-500`}
                >
                  {href ? <a href={href}>{content}</a> : <span>{content}</span>}

                  {children && (
                    <div class="hidden rounded-b-md rounded-tr-md absolute bottom overflow-hidden">
                      {children.map(({
                        href,
                        content,
                      }) => (
                        <a class="block px-3 hover:bg-border" href={href}>
                          {content}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <GlobalSearch denoVersion={versions.cli[0]} />

            <a
              href="https://github.com/denoland/deno"
              class="my-auto hidden lg:block"
            >
              <span class="sr-only">GitHub</span>
              <Icons.GitHub class="h-5 w-auto text-gray-600 hover:text-black" />
            </a>
            <a
              href="https://discord.gg/deno"
              class="my-auto hidden lg:block"
            >
              <span class="sr-only">Discord</span>
              <Icons.Discord class="h-5 w-auto text-gray-600 hover:text-black" />
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
