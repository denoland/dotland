// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { ComponentChildren, h } from "preact";
import { tw } from "@twind";
import * as Icons from "./Icons.tsx";

export function Footer() {
  return (
    <div
      class={tw
        `border-t border-secondary bg-[#F9F9F9] py-18 text-sm flex justify-center`}
    >
      <nav class={tw`flex space-x-20 leading-tight`}>
        <div>
          <a href="https://deno.land">
            <img class={tw`h-6 w-auto`} src="/logo.svg" alt="" />
          </a>
        </div>
        <FooterSection
          title="Why Deno?"
          entries={{
            "Develop Locally": "https://deno.land",
            "Develop Globally": "https://deno.com/deploy",
            "Benchmarks": "https://deno.land/benchmarks",
          }}
        />
        <FooterSection
          title="Products"
          entries={{
            "Deno CLI": "https://deno.land",
            "Deno Deploy": "https://deno.com/deploy",
          }}
        />
        <FooterSection
          title="Sources"
          entries={{
            "CLI Manual": "https://deno.land/manual",
            "CLI Runtime API": "https://doc.deno.land/deno/stable",
            "Deploy Manual": "https://deno.com/deploy/docs",
            "Standard Library": "https://deno.land/std",
            "Third-Party Modules": "https://deno.land/x",
          }}
        />
        <FooterSection
          title="Community"
          entries={{
            "Artworks": "https://deno.land/artwork",
            "Translations": "https://deno.land/translations",
            "Showcase": "https://deno.land/showcase",
          }}
        />
        <FooterSection
          title="Company"
          entries={{
            "Blog": "https://deno.com/blog",
            "Jobs": "https://deno.com/jobs",
            "Pricing": "https://deno.com/deploy/pricing",
            "Status": "https://status.deno.com",
            "News": "https://deno.news",
          }}
        />
        <div class={tw`flex space-x-4.5`}>
          <a href="https://github.com/denoland">
            <Icons.GitHub />
          </a>
          <a href="https://discord.gg/deno">
            <Icons.Discord />
          </a>
          <a href="https://twitter.com/deno_land">
            <Icons.Twitter />
          </a>
        </div>
      </nav>
    </div>
  );
}

function FooterSection(
  { title, entries }: { title: string; entries: Record<string, string> },
) {
  return (
    <div>
      <span class={tw`font-semibold`}>{title}</span>
      <div class={tw`mt-4 space-y-2.5 text-[#454545]`}>
        {Object.entries(entries).map(([name, link]) => {
          return <a href={link} class={tw`block`}>{name}</a>;
        })}
      </div>
    </div>
  );
}
