// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";

import { apply, css, tw } from "@twind";
import * as Icons from "./Icons.tsx";
import GlobalSearch from "@/islands/GlobalSearch.tsx";

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
  main,
}: {
  selected?: (typeof entries)[number]["content"];
  main?: boolean;
}) {
  return (
    <div
      class={tw(
        !main
          ? "bg-primary border-b border-light-border backdrop-blur-3xl"
          : "",
      )}
    >
      <div class={tw`section-x-inset-xl py-5.5`}>
        <nav class={tw`flex justify-between flex-col lg:flex-row`}>
          <input
            type="checkbox"
            id="menuToggle"
            class={tw
              `hidden checked:siblings:flex checked:sibling:children:last-child:children:(first-child:hidden last-child:block)`}
            autoComplete="off"
          />

          <div
            class={tw
              `h-9 flex flex-1 items-center justify-between lg:justify-start select-none w-full lg:w-min gap-3 md:gap-6 lg:gap-8`}
          >
            <a
              href="/"
              class={tw`h-8 w-8 block ${
                css({
                  "flex-shrink": "0",
                })
              }`}
            >
              <img class={tw`h-full w-full`} src="/logo.svg" alt="Deno Logo" />
            </a>

            {!main && <GlobalSearch />}

            <label
              tabIndex={0}
              class={tw`lg:hidden checked:bg-red-100`}
              for="menuToggle"
              // @ts-ignore onKeyDown does support strings
              onKeyDown="if (event.code === 'Space' || event.code === 'Enter') { this.click(); event.preventDefault(); }"
            >
              <Icons.Menu />
              <Icons.Cross class={tw`hidden`} />
            </label>
          </div>

          <div
            class={tw
              `hidden flex-col mx-2 mt-5 gap-y-4 lg:(flex flex-row items-center mx-0 mt-0) font-medium`}
          >
            {entries.map(({ href, content }) => {
              return (
                <a
                  href={href}
                  class={tw
                    `lg:ml-4 px-2 rounded-md leading-loose hover:(bg-gray-100 text-main) ${apply
                      `${
                        content === selected
                          ? css({
                            "text-decoration-line": "underline",
                            "text-underline-offset": "6px",
                            "text-decoration-thickness": "2px",
                          })
                          : ""
                      } ${
                        content === selected ? "text-black" : "text-gray-500"
                      }`}`}
                >
                  {content}
                </a>
              );
            })}

            <a
              href="https://deno.com/deploy"
              class={tw
                `h-9 lg:ml-5 bg-secondary rounded-md px-4 flex items-center hover:bg-[#D5D7DB]`}
            >
              Deploy
            </a>

            <a
              href="https://github.com/denoland"
              class={tw`lg:ml-5 my-auto hidden lg:block`}
            >
              <span class={tw`sr-only`}>GitHub</span>
              <Icons.GitHub class="inline" />
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
