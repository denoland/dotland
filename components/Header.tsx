// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "$fresh/runtime.ts";
import { tw } from "@twind";
import * as Icons from "./Icons.tsx";

const entries = [
  { href: "/manual", content: "参考手册" },
  { href: "https://deno.com/blog", content: "博客" },
  {
    href: "https://doc.deno.land/deno/stable",
    content: "API",
  },
  { href: "/std", content: "标准库" },
  { href: "/x", content: "第三方模块" },
] as const;

export function Header({
  subtitle,
  widerContent,
  main,
}: {
  subtitle?: string;
  widerContent?: boolean;
  main?: boolean;
}) {
  return (
    <div class={tw`relative py-6 z-10`}>
      <nav
        class={tw
          `mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 ${
            widerContent ? "max-w-screen-xl" : "max-w-screen-lg lg:p-0"
          }`}
      >
        <a class={tw`flex items-center`} href="/">
          <img class={tw`h-10 w-auto sm:h-12 my-2`} src="/logo.svg" alt="" />
          <div class={tw`ml-5 flex flex-col justify-center`}>
            {!main &&
              (
                <div
                  class={tw
                    `font-bold text-gray-900 leading-tight text-2xl sm:text-3xl tracking-tight`}
                >
                  Deno
                </div>
              )}
            {subtitle &&
              (
                <div
                  class={tw
                    `font-normal text-sm sm:text-lg leading-tight tracking-tight`}
                >
                  {subtitle}
                </div>
              )}
          </div>
        </a>
        <input
          type="checkbox"
          class={tw`hidden checked:sibling:block`}
          id="menuToggle"
          autoComplete="off"
        />
        <div
          class={tw
            `hidden absolute top-0 inset-x-0 p-2 transition transform origin-top-right lg:hidden`}
        >
          <div class={tw`rounded-lg shadow-md`}>
            <div class={tw`rounded-lg bg-white shadow-xs overflow-hidden`}>
              <div class={tw`px-5 pt-4 flex items-center justify-between`}>
                <a href="/" class={tw`flex items-center`}>
                  <img
                    class={tw`h-10 w-auto sm:h-12 my-2`}
                    src="/logo.svg"
                    alt=""
                  />
                  <div class={tw`ml-5 flex flex-col justify-center`}>
                    <div
                      class={tw
                        `font-bold text-gray-900 leading-tight text-2xl sm:text-3xl tracking-tight`}
                    >
                      Deno
                    </div>
                    {subtitle &&
                      (
                        <div
                          class={tw
                            `font-normal text-sm sm:text-lg leading-tight tracking-tight`}
                        >
                          {subtitle}
                        </div>
                      )}
                  </div>
                </a>{" "}
                <label class={tw`-mr-2`} htmlFor="menuToggle">
                  <div
                    class={tw
                      `inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:(text-gray-500 bg-gray-100) focus:(outline-none bg-gray-100 text-gray-500) transition duration-150 ease-in-out`}
                  >
                    <Icons.Cross />
                  </div>
                </label>
              </div>
              <div class={tw`px-2 pt-4 pb-3`}>
                <a
                  href="https://deno.com/deploy"
                  class={tw
                    `block px-3 py-2 rounded-md text-base font-medium rounded-lg border-2 border-gray-700 bg-transparent text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-gray-50 focus:(outline-none text-gray-900 bg-gray-50) transition duration-150 ease-in-out`}
                >
                  Deploy
                </a>
                {entries.map(({ href, content }) => (
                  <a
                    href={href}
                    class={tw
                      `block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:(text-gray-900 bg-gray-50) focus:(outline-none text-gray-900 bg-gray-50) transition duration-150 ease-in-out`}
                  >
                    {content}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <label
          class={tw`-mr-2 flex items-center lg:hidden`}
          htmlFor="menuToggle"
        >
          <div
            class={tw
              `inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:(text-gray-500 bg-gray-100) focus:(outline-none bg-gray-100 text-gray-500) transition duration-150 ease-in-out`}
          >
            <Icons.Menu title="菜单 | Deno" />
          </div>
        </label>
        <div class={tw`hidden lg:flex md:ml-10 items-end`}>
          <a
            href="https://deno.com/deploy"
            class={tw
              `font-medium py-2 px-3 rounded-lg border-2 border-gray-700 bg-transparent text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-gray-50 transition duration-150 ease-in-out`}
          >
            Deploy
          </a>
          {entries.map(({ href, content }) => (
            <a
              href={href}
              class={tw
                `ml-10 my-auto font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out`}
            >
              {content}
            </a>
          ))}
          <a
            href="https://github.com/denoland"
            class={tw
              `ml-10 my-auto text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out leading-0`}
          >
            <span class={tw`sr-only`}>GitHub</span>
            <Icons.GitHub class="inline" />
          </a>
        </div>
      </nav>
    </div>
  );
}
