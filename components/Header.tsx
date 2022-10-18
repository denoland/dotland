// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { apply, tw } from "twind";
import { css } from "twind/css";
import * as Icons from "./Icons.tsx";
import GlobalSearch from "@/islands/GlobalSearch.tsx";
import versions from "@/versions.json" assert { type: "json" };

const entries = [
  { href: "/manual", content: "Manual" },
  { href: "/api", content: "API" },
  { href: "/std", content: "Standard Library" },
  { href: "/x", content: "Third Party Modules" },
] as const;

type ContentTypes = (typeof entries)[number]["content"];

export function Header({ selected, main, manual }: {
  selected?: ContentTypes;
  main?: boolean;
  manual?: boolean;
}) {
  return (
    <div
      class={tw(
        manual
          ? "lg:border-b border-light-border"
          : !main
          ? "bg-primary border-b border-light-border backdrop-blur-3xl"
          : "",
      )}
    >
      <div class="section-x-inset-xl py-5.5">
        <nav class="flex justify-between flex-col lg:flex-row">
          <input
            type="checkbox"
            id="menuToggle"
            class="hidden checked:siblings:flex checked:sibling:children:last-child:children:(first-child:hidden last-child:block)"
            autoComplete="off"
          />

          <div class="h-9 flex flex-1 items-center justify-between lg:justify-start select-none w-full lg:w-min gap-3 md:gap-6 lg:gap-8">
            <a
              href="/"
              class={tw`h-8 w-8 block ${
                css({
                  "flex-shrink": "0",
                })
              }`}
            >
              <img class="h-full w-full" src="/logo.svg" alt="Deno Logo" />
            </a>

            <GlobalSearch denoVersion={versions.cli[0]} />

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

          <div class="hidden flex-col mx-2 mt-5 gap-y-4 lg:(flex flex-row items-center mx-0 mt-0) font-medium">
            {entries.map(({ href, content }) => (
              <a
                href={href}
                class={tw`lg:ml-4 px-2 rounded-md leading-loose hover:(bg-gray-100 text-main) ${apply`${
                  content === selected
                    ? css({
                      "text-decoration-line": "underline",
                      "text-underline-offset": "6px",
                      "text-decoration-thickness": "2px",
                    })
                    : ""
                } ${content === selected ? "text-black" : "text-gray-500"}`}`}
              >
                {content}
              </a>
            ))}

            <a
              href="https://deno.com/deploy"
              class="button-outline lg:ml-5"
            >
              Deploy
            </a>

            <a
              href="https://github.com/denoland/deno"
              class="lg:ml-5 my-auto hidden lg:block"
            >
              <span class="sr-only">GitHub</span>
              <Icons.GitHub class="h-5 w-auto text-main hover:text-default-highlight" />
            </a>
            <a
              href="https://discord.gg/deno"
              class="lg:ml-5 my-auto hidden lg:block"
            >
              <span class="sr-only">Discord</span>
              <Icons.Discord class="h-5 w-auto text-main hover:text-default-highlight" />
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
