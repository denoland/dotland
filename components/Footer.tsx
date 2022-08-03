// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import * as Icons from "./Icons.tsx";

export function Footer() {
  return (
    <div
      class={tw`border-t border-secondary bg-[#F9F9F9] text-sm flex justify-center`}
    >
      <div class={tw`section-x-inset-xl py-7 lg:py-18 w-full`}>
        <nav
          class={tw`flex flex-col gap-7 w-full leading-tight lg:(flex-row gap-0 items-start justify-between)`}
        >
          <a href="https://deno.land" class={tw`flex items-center gap-2`}>
            <img class={tw`h-6 w-6`} src="/logo.svg" alt="Deno Logo" />
            <Icons.Deno class="lg:hidden" />
          </a>

          <div
            class={tw`flex flex-col gap-0 divide-incl-y lg:(flex-row gap-16 divide-incl-y-0)`}
          >
            <FooterSection
              title="Why Deno?"
              entries={{
                "Develop Locally": "https://deno.land",
                "Deploy Globally": "https://deno.com/deploy",
                "Compare to Node.js": "https://deno.land/manual/node",
                "Benchmarks": "https://deno.land/benchmarks",
              }}
            />
            <FooterSection
              title="产品"
              entries={{
                "Deno CLI": "https://deno.land",
                "Deno Deploy": "https://deno.com/deploy",
                "Deploy Subhosting": "https://deno.com/deploy/subhosting",
              }}
            />
            <FooterSection
              title="Sources"
              entries={{
                "CLI Manual": "https://deno.land/manual",
                "CLI Runtime API": "https://doc.deno.land/deno/stable",
                "Deploy Docs": "https://deno.com/deploy/docs",
                "Standard Library": "https://deno.land/std",
                "Third-Party Modules": "https://deno.land/x",
              }}
            />
            <FooterSection
              title="社区"
              entries={{
                "Artworks": "https://deno.land/artwork",
                "Translations": "https://deno.land/translations",
                "Showcase": "https://deno.land/showcase",
              }}
            />
            <FooterSection
              title="公司"
              entries={{
                "Blog": "https://deno.com/blog",
                "Pricing": "https://deno.com/deploy/pricing",
                "News": "https://deno.news",
                "Privacy Policy": "https://deno.com/deploy/docs/privacy-policy",
              }}
            />
          </div>

          <div class={tw`space-y-5 w-60`}>
            <iframe
              src="https://denostatus.com/embed-status/light-sm"
              height="41"
              frameBorder="0"
              scrolling="no"
              style="border: none;"
              class={tw`w-full rounded-lg focus:outline-none`}
            />

            <div class={tw`space-y-2.5 lg:space-y-4.5`}>
              <span class={tw`text-xs text-[#9CA0AA] leading-tight`}>
                Copyright © 2022 Deno Land Inc.{" "}
                <span class={tw`whitespace-nowrap`}>All rights reserved.</span>
              </span>
              <a class={tw`block text-[#7B61FF]`} href="https://deno.com/jobs">
                {"We are hiring, join us -->"}
              </a>
            </div>

            <div class={tw`flex gap-3 text-[#6C6E78]`}>
              <a href="https://github.com/denoland">
                <Icons.GitHub class="hover:text-default-highlight" />
              </a>
              <a href="https://discord.gg/deno">
                <Icons.Discord class="hover:text-default-highlight" />
              </a>
              <a href="https://twitter.com/deno_land">
                <Icons.Twitter class="hover:text-default-highlight" />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

function FooterSection(
  { title, entries }: { title: string; entries: Record<string, string> },
) {
  return (
    <div>
      <input
        type="checkbox"
        id={title}
        class={tw`hidden checked:(siblings:last-child:flex sibling:children:last-child:children:(odd:hidden even:block))`}
        autoComplete="off"
      />
      <label
        htmlFor={title}
        tabIndex={0}
        class={tw`flex items-center justify-between px-1 my-3 lg:(px-0 my-0)`}
      >
        <span class={tw`text-sm font-semibold`}>{title}</span>
        <div class={tw`lg:hidden text-[#9CA0AA]`}>
          <Icons.Plus />
          <Icons.Minus class="hidden" />
        </div>
      </label>
      <div
        class={tw`hidden text-[#6C6E78] flex-col flex-wrap pl-1 pb-2 mb-3 gap-2.5 lg:(flex p-0 mt-4 mb-0)`}
      >
        {Object.entries(entries).map(([name, link]) => (
          <a href={link} class={tw`whitespace-nowrap block hover:underline`}>
            {name}
          </a>
        ))}
      </div>
    </div>
  );
}
