// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { ComponentChildren, h } from "preact";
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
