// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "../deps.ts";

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
    <div class="relative py-6 z-10">
      <nav
        class={`mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 ${
          widerContent ? "max-w-screen-xl" : "max-w-screen-lg lg:p-0"
        }`}
      >
        <a class="flex items-center" href="/">
          <img class="h-10 w-auto sm:h-12 my-2" src="/logo.svg" alt="" />
          <div class="ml-5 flex flex-col justify-center">
            {!main &&
              (
                <div class="font-bold text-gray-900 leading-tight text-2xl sm:text-3xl tracking-tight">
                  Deno
                </div>
              )}
            {subtitle &&
              (
                <div class="font-normal text-sm sm:text-lg leading-tight tracking-tight">
                  {subtitle}
                </div>
              )}
          </div>
        </a>
        <input
          type="checkbox"
          class="hidden checked:sibling:block"
          id="menuToggle"
          autoComplete="off"
        />
        <div class="hidden absolute top-0 inset-x-0 p-2 transition transform origin-top-right lg:hidden">
          <div class="rounded-lg shadow-md">
            <div class="rounded-lg bg-white shadow-xs overflow-hidden">
              <div class="px-5 pt-4 flex items-center justify-between">
                <a href="/" class="flex items-center">
                  <img
                    class="h-10 w-auto sm:h-12 my-2"
                    src="/logo.svg"
                    alt=""
                  />
                  <div class="ml-5 flex flex-col justify-center">
                    <div class="font-bold text-gray-900 leading-tight text-2xl sm:text-3xl tracking-tight">
                      Deno
                    </div>
                    {subtitle &&
                      (
                        <div class="font-normal text-sm sm:text-lg leading-tight tracking-tight">
                          {subtitle}
                        </div>
                      )}
                  </div>
                </a>{" "}
                <label class="-mr-2" htmlFor="menuToggle">
                  <div class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:(text-gray-500 bg-gray-100) focus:(outline-none bg-gray-100 text-gray-500) transition duration-150 ease-in-out">
                    <svg
                      class="h-6 w-6"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </label>
              </div>
              <div class="px-2 pt-4 pb-3">
                <a
                  href="https://deno.com/deploy"
                  class="block px-3 py-2 rounded-md text-base font-medium rounded-lg border-2 border-gray-900 bg-gray-900 text-gray-200 hover:border-gray-700 hover:bg-transparent hover:text-gray-900 focus:(outline-none text-gray-900 bg-gray-50) transition duration-150 ease-in-out"
                >
                  Deploy
                </a>
                {entries.map(({ href, content }) => (
                  <a
                    href={href}
                    class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:(text-gray-900 bg-gray-50) focus:(outline-none text-gray-900 bg-gray-50) transition duration-150 ease-in-out"
                  >
                    {content}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <label
          class="-mr-2 flex items-center lg:hidden"
          htmlFor="menuToggle"
        >
          <div class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:(text-gray-500 bg-gray-100) focus:(outline-none bg-gray-100 text-gray-500) transition duration-150 ease-in-out">
            <svg
              class="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <title>菜单 | Deno</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
        </label>
        <div class="hidden lg:flex md:ml-10 items-end">
          <a
            href="https://deno.com/deploy"
            class="font-medium py-2 px-3 rounded-lg border-2 border-gray-900 bg-gray-900 text-gray-200 hover:border-gray-700 hover:bg-transparent hover:text-gray-900 transition duration-150 ease-in-out"
          >
            Deploy
          </a>
          <a
            href="/manual"
            class="ml-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
          >
            参考手册
          </a>
          <a
            href="https://deno.com/blog"
            class="ml-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
          >
            博客
          </a>
          <a
            href="https://doc.deno.js.cn/deno/stable"
            class="ml-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
          >
            API
          </a>
          <a
            href="/std"
            class="ml-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
          >
            标准库
          </a>
          <a
            href="/x"
            class="ml-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
          >
            第三方模块
          </a>
          <a
            href="https://github.com/denoland"
            class="ml-10 my-auto text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out leading-0"
          >
            <span class="sr-only">GitHub</span>
            <svg
              class="h-6 w-6 inline"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <title>GitHub | Deno</title>
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </nav>
    </div>
  );
}
