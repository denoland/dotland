// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { ComponentChildren, h } from "$fresh/runtime.ts";
import { tw } from "@twind";
import * as Icons from "./Icons.tsx";

export function Footer({ simple }: { simple?: boolean }) {
  return (
    <div class={simple ? undefined : "bg-gray-50 border-t border-gray-200"}>
      <div
        class={tw
          `max-w-screen-xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8`}
      >
        <nav class={tw`-mx-5 -my-2 flex flex-wrap justify-center`}>
          <FooterItem href="/manual">
            Manual
          </FooterItem>
          <FooterItem href="https://doc.deno.land/deno/stable">
            API
          </FooterItem>
          <FooterItem href="/std">
            Standard Library
          </FooterItem>
          <FooterItem href="/x">
            Third Party Modules
          </FooterItem>
          <FooterItem href="/benchmarks">
            Benchmarks
          </FooterItem>
          <FooterItem href="/artwork">
            Artwork
          </FooterItem>
          <FooterItem href="https://deno.com/blog">
            Blog
          </FooterItem>
          <FooterItem href="/translations">
            Translations
          </FooterItem>
          <FooterItem href="https://status.deno.land/">
            System Status
          </FooterItem>
          <FooterItem href="/showcase">
            Showcase
          </FooterItem>
          <FooterItem href="https://deno.news/">
            Deno News
          </FooterItem>
        </nav>
        <div class={tw`mt-9 flex justify-center`}>
          <a
            href="https://github.com/denoland"
            class={tw`text-gray-400 hover:text-gray-500`}
          >
            <span class={tw`sr-only`}>GitHub</span>
            <Icons.GitHub />
          </a>
          <a
            href="https://discord.gg/deno"
            class={tw`ml-6 text-gray-400 hover:text-gray-500`}
          >
            <span class={tw`sr-only`}>Discord</span>
            <Icons.Discord />
          </a>
          <a
            href="https://twitter.com/deno_land"
            class={tw`ml-6 text-gray-400 hover:text-gray-500`}
          >
            <span class={tw`sr-only`}>Twitter</span>
            <Icons.Twitter />
          </a>
        </div>
        <div class={tw`mt-6 flex justify-center flex-wrap`}>
          <a href="https://github.com/denoland/deno">
            <img
              class={tw`m-2 opacity-75`}
              alt="denoland/deno CI"
              src="https://img.shields.io/github/workflow/status/denoland/deno/ci/main?label=deno&logo=github"
            />
          </a>
          <a href="https://github.com/denoland/rusty_v8">
            <img
              class={tw`m-2 opacity-75`}
              alt="denoland/rusty_v8 CI"
              src="https://img.shields.io/github/workflow/status/denoland/rusty_v8/ci/main?label=rusty_v8&logo=github"
            />
          </a>
          <a href="https://github.com/denoland/deno_lint">
            <img
              class={tw`m-2 opacity-75`}
              alt="denoland/deno_lint CI"
              src="https://img.shields.io/github/workflow/status/denoland/deno_lint/ci/main?label=deno_lint&logo=github"
            />
          </a>
          <a href="https://github.com/denoland/deno_doc">
            <img
              class={tw`m-2 opacity-75`}
              alt="denoland/deno_doc CI"
              src="https://img.shields.io/github/workflow/status/denoland/deno_doc/ci/main?label=deno_doc&logo=github"
            />
          </a>
          <a href="https://github.com/denoland/dotland">
            <img
              class={tw`m-2 opacity-75`}
              alt="denoland/dotland CI"
              src="https://img.shields.io/github/workflow/status/denoland/dotland/ci/main?label=dotland&logo=github"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

function FooterItem(
  { href, children }: { href: string; children: ComponentChildren },
) {
  return (
    <div class={tw`px-2 py-2`}>
      <a
        href={href}
        class={tw`text-base leading-6 text-gray-500 hover:text-gray-900`}
      >
        {children}
      </a>
    </div>
  );
}
