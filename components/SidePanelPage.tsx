// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import type { ComponentChildren } from "preact";
import * as Icons from "@/components/Icons.tsx";

export function SidePanelPage({ children, sidepanel }: {
  children: ComponentChildren;
  sidepanel?: ComponentChildren;
}) {
  return (
    <div>
      {sidepanel && (
        <>
          <input
            type="checkbox"
            id="SidePanelToggle"
            class="hidden checked:siblings:last-child:children:first-child:flex checked:sibling:(border-0 children:children:first-child:rotate-90)"
            autoComplete="off"
          />

          <label
            htmlFor="SidePanelToggle"
            class="lg:hidden block pl-5 py-2.5 font-medium border-b border-border"
          >
            <div class="flex gap-2 items-center px-1.5">
              <Icons.ChevronRight class="text-gray-400" />
              Menu
            </div>
          </label>
        </>
      )}

      <div class="flex flex-col mt-0 mb-16 lg:(flex-row gap-12 max-w-8xl mx-auto)">
        {sidepanel && (
          <div class="sticky top-0 hidden pb-2 w-full h-[calc(100vh-4.5rem)] border-b border-border lg:(pb-0 border-none block w-72 flex-shrink-0)">
            <div class="w-full space-y-8 section-x-inset-xl lg:section-x-inset-none">
              {sidepanel}
            </div>
          </div>
        )}

        <main
          class="focus:outline-none min-w-0 w-full flex flex-col section-x-inset-xl mt-7 lg:(section-x-inset-none mt-16)"
          tabIndex={0}
        >
          {children}
        </main>

        <div class="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
          <nav aria-labelledby="on-this-page-title" class="w-56">
            <h2
              id="on-this-page-title"
              class="font-display text-sm font-medium text-slate-900 dark:text-white"
            >
              On this page
            </h2>
            <ol role="list" class="mt-4 space-y-3 text-sm">
              <li>
                <h3>
                  <a class="text-sky-500" href="/#quick-start">Quick start</a>
                </h3>
                <ol
                  role="list"
                  class="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400"
                >
                  <li>
                    <a
                      class="hover:text-slate-600 dark:hover:text-slate-300"
                      href="/#installing-dependencies"
                    >
                      Installing dependencies
                    </a>
                  </li>
                  <li>
                    <a
                      class="hover:text-slate-600 dark:hover:text-slate-300"
                      href="/#configuring-the-library"
                    >
                      Configuring the library
                    </a>
                  </li>
                </ol>
              </li>
              <li>
                <h3>
                  <a
                    class="font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    href="/#basic-usage"
                  >
                    Basic usage
                  </a>
                </h3>
                <ol
                  role="list"
                  class="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400"
                >
                  <li>
                    <a
                      class="hover:text-slate-600 dark:hover:text-slate-300"
                      href="/#your-first-cache"
                    >
                      Your first cache
                    </a>
                  </li>
                  <li>
                    <a
                      class="hover:text-slate-600 dark:hover:text-slate-300"
                      href="/#clearing-the-cache"
                    >
                      Clearing the cache
                    </a>
                  </li>
                  <li>
                    <a
                      class="hover:text-slate-600 dark:hover:text-slate-300"
                      href="/#adding-middleware"
                    >
                      Adding middleware
                    </a>
                  </li>
                </ol>
              </li>
              <li>
                <h3>
                  <a
                    class="font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    href="/#getting-help"
                  >
                    Getting help
                  </a>
                </h3>
                <ol
                  role="list"
                  class="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400"
                >
                  <li>
                    <a
                      class="hover:text-slate-600 dark:hover:text-slate-300"
                      href="/#submit-an-issue"
                    >
                      Submit an issue
                    </a>
                  </li>
                  <li>
                    <a
                      class="hover:text-slate-600 dark:hover:text-slate-300"
                      href="/#join-the-community"
                    >
                      Join the community
                    </a>
                  </li>
                </ol>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
}

const entries = {
  "Manual": "/manual",
  "Runtime APIs": "/api",
} as const;

export function ManualOrAPI(
  { current, version }: { current: keyof typeof entries; version: string },
) {
  return (
    <div class="border-b border-border flex gap-1">
      {(["Manual", "Runtime APIs"] as const).map((key) => (
        <a
          class="-mb-px px-2.5 font-medium leading-none rounded-md hover:bg-grayDefault text-sm"
          href={`${entries[key]}@${version}`}
        >
          <div
            class={`pt-2 ${
              key === current ? "border-b-2 border-black pb-1.5" : "pb-2"
            }`}
          >
            {key}
          </div>
        </a>
      ))}
    </div>
  );
}
