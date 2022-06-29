// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";

import { css, tw } from "@twind";
import * as Icons from "./Icons.tsx";
import { Head } from "$fresh/src/runtime/head.ts";

const entries = [
<<<<<<< HEAD
  { href: "/manual", content: "参考手册" },
  { href: "https://deno.com/blog", content: "博客" },
=======
  { href: "/manual", content: "Manual" },
>>>>>>> 7d0fbed0c03c306bc7044d7c289747fc2a3c00fa
  {
    href: "https://doc.deno.land/deno/stable",
    content: "API",
  },
<<<<<<< HEAD
  { href: "/std", content: "标准库" },
  { href: "/x", content: "第三方模块" },
=======
  { href: "/std", content: "Standard Library" },
  { href: "/x", content: "Third Party Modules" },
  { href: "https://deno.com/blog", content: "Blog" },
>>>>>>> 7d0fbed0c03c306bc7044d7c289747fc2a3c00fa
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
              `h-9 flex items-center justify-between select-none w-full lg:w-auto gap-3 md:gap-6 lg:gap-8`}
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

            {!main && <Search />}

            <label
              class={tw`lg:hidden checked:bg-red-100`}
              for="menuToggle"
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
              if (content === selected) {
                return (
                  <a
                    href={href}
                    class={tw`lg:ml-8 text-black ${
                      css({
                        "text-decoration-line": "underline",
                        "text-underline-offset": "6px",
                        "text-decoration-thickness": "2px",
                      })
                    }`}
                  >
                    {content}
                  </a>
<<<<<<< HEAD
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
=======
                );
              } else {
                return (
                  <a href={href} class={tw`lg:ml-8 text-main`}>
                    {content}
                  </a>
                );
              }
            })}

>>>>>>> 7d0fbed0c03c306bc7044d7c289747fc2a3c00fa
            <a
              href="https://deno.com/deploy"
              class={tw
                `h-9 lg:ml-5 bg-secondary rounded-md px-4 flex items-center`}
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

function Search() {
  // TODO: implement this properly with an island
  return (
    <>
      <Head>
        <link
          rel="preconnect"
          href="https://BH4D9OD16A-dsn.algolia.net"
          crossOrigin="true"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@docsearch/css@3"
        />
      </Head>
      <script src="https://cdn.jsdelivr.net/npm/@docsearch/js@3" />
      <div id="search" class={tw`hidden`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
        docsearch({
          container: "#search",
          appId: "DMFING7U5D",
          indexName: "deno_manual",
          apiKey: "577997f9f7a4b0100d359afde8065583",
          searchParameters: {
            distinct: 1,
          },
        });
      `,
        }}
      />

      <button
        class={tw
          `pl-4 w-80 bg-[#F3F3F3] flex-auto lg:flex-none rounded-md text-light focus:(outline-none)`}
        // @ts-ignore onClick does support strings
        onClick="document.querySelector('#search button').click()"
      >
        <div class={tw`flex items-center pointer-events-none`}>
          <Icons.MagnifyingGlass />
          {/*<input class={tw`ml-1.5 py-2.5 h-9 flex-auto bg-transparent placeholder:text-light text-default text-sm leading-4 font-medium appearance-none`} type="text" placeholder="Search..." />*/}
          <div
            class={tw
              `ml-1.5 py-2.5 h-9 flex-auto text-light text-sm leading-4 font-medium text-left`}
          >
            Search...
          </div>
          <div class={tw`mx-4`}>
            ⌘K
          </div>
        </div>
      </button>
    </>
  );
}
