// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "../deps.ts";

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
          <div class="mr-5 flex flex-col justify-center">
            {!main &&
              (
                <div class="font-bold text-gray-900 leading-tight text-2xl sm:text-3xl tracking-tight">
                  دێنۆ
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
                  <div class="mr-5 flex flex-col justify-center">
                    <div class="font-bold text-gray-900 leading-tight text-2xl sm:text-3xl tracking-tight">
                      دێنۆ
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
                {[
                  { href: "https://deno.com/deploy", content: "Deploy" },
                  { href: "/manual", content: "Manual" },
                  { href: "https://deno.com/blog", content: "Blog" },
                  {
                    href: "https://doc.deno.land/builtin/stable",
                    content: "API",
                  },
                  { href: "/std", content: "Standard Library" },
                  { href: "/x", content: "Third Party Modules" },
                ].map(({ href, content }) => (
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
              <title>پێڕست | دێنۆ</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
        </label>
        <div class="hidden lg:flex md:mr-10 items-end">
          <a
            href="https://deno.com/deploy"
            class="font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
          >
            دیپڵۆی
          </a>
          <a
            href="/manual"
            class="mr-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
          >
            مانواڵ
          </a>
          <a
            href="https://deno.com/blog"
            class="mr-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
          >
            بڵۆگ
          </a>
          <a
            href="https://doc.deno.land/builtin/stable"
            class="mr-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
          >
            API
          </a>
          <a
            href="/std"
            class="mr-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
          >
            کتێبخانەی ستاندارد
          </a>
          <a
            href="/x"
            class="mr-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
          >
            مۆدیوڵەکان
          </a>
          <a
            href="https://github.com/denoland"
            class="mr-10 text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out leading-0"
          >
            <span class="sr-only">گیتهەب</span>
            <svg
              class="h-6 w-6 inline"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <title>گیتهەب | دێنۆ</title>
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
