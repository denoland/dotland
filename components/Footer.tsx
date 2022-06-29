// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import * as Icons from "./Icons.tsx";

export function Footer() {
  return (
<<<<<<< HEAD
    <div class={simple ? undefined : "bg-gray-50 border-t border-gray-200"}>
      <div
        class={tw
          `max-w-screen-xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8`}
      >
        <nav class={tw`-mx-5 -my-2 flex flex-wrap justify-center`}>
          <FooterItem href="/manual">
            参考手册
          </FooterItem>
          <FooterItem href="https://doc.deno.js.cn/deno/stable">
            API
          </FooterItem>
          <FooterItem href="/std">
            标准库
          </FooterItem>
          <FooterItem href="/x">
            第三方模块
          </FooterItem>
          <FooterItem href="/benchmarks">
            性能
          </FooterItem>
          <FooterItem href="/artwork">
            艺术作品
          </FooterItem>
          <FooterItem href="https://deno.com/blog">
            博客
          </FooterItem>
          <FooterItem href="/translations">
            翻译
          </FooterItem>
          <FooterItem href="/showcase">
            案例展示
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
=======
    <div
      class={tw
        `border-t border-secondary bg-[#F9F9F9] text-sm flex justify-center`}
    >
      <div class={tw`section-x-inset-xl py-6 lg:py-18 w-full`}>
        <nav
          class={tw
            `flex flex-col gap-6 w-full lg:(flex-row gap-0 justify-between) leading-tight`}
        >
          <div class={tw`hidden lg:block`}>
            <a href="https://deno.land">
              <img class={tw`h-6 w-6`} src="/logo.svg" alt="Deno Logo" />
            </a>
          </div>
          <div class={tw`flex flex-col gap-5 lg:(flex-row gap-16)`}>
            <FooterSection
              title="Why Deno?"
              entries={{
                "Develop Locally": "https://deno.land",
                "Develop Globally": "https://deno.com/deploy",
                "Compare to Node.js": "https://deno.land/manual/node",
                "Benchmarks": "https://deno.land/benchmarks",
              }}
            />
            <FooterSection
              title="Products"
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
                "News": "https://deno.news",
                "Privacy Policy": "https://deno.com/deploy/docs/privacy-policy",
              }}
            />
          </div>
          <div class={tw`space-y-5 lg:w-60`}>
            <iframe
              src="https://denostatus.com/embed-status/light-sm"
              height="42"
              frameBorder="0"
              scrolling="no"
              style="border: none;"
              class={tw`w-full lg:w-60 focus:outline-none`}
            />
            <div
              class={tw
                `flex flex-row justify-between items-center lg:(flex-col space-y-5 items-start)`}
            >
              <span class={tw`text-xs text-gray-400 leading-tight`}>
                Copyright © 2022 Deno Company{" "}
                <span class={tw`whitespace-nowrap`}>All rights reserved.</span>
              </span>
              <div class={tw`flex gap-3 text-[#666666]`}>
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
            </div>
          </div>
        </nav>
>>>>>>> 7d0fbed0c03c306bc7044d7c289747fc2a3c00fa
      </div>
    </div>
  );
}

function FooterSection(
  props: { title: string; entries: Record<string, string> },
) {
  return (
    <div>
      <span class={tw`font-semibold`}>{props.title}</span>
      <div
        class={tw
          `text-[#454545] flex flex-wrap mt-2 gap-x-2.5 gap-y-1.5 lg:(flex-col mt-4 gap-x-0 gap-y-2.5)`}
      >
        {Object.entries(props.entries).map(([name, link]) => {
          return <a href={link} class={tw`whitespace-nowrap block`}>{name}</a>;
        })}
      </div>
    </div>
  );
}
