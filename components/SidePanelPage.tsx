// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { type ComponentChildren } from "preact";
import { tw } from "twind";
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

      <div class="flex flex-col mt-0 mb-16 lg:(flex-row mt-12 gap-12 section-x-inset-xl)">
        {sidepanel && (
          <div class="hidden pb-2 w-full border-b border-border lg:(pb-0 border-none block w-72 flex-shrink-0)">
            <div class="w-full space-y-5 section-x-inset-xl lg:section-x-inset-none">
              {sidepanel}
            </div>
          </div>
        )}

        <main
          class="focus:outline-none min-w-0 w-full flex flex-col section-x-inset-xl mt-7 lg:(section-x-inset-none mt-0)"
          tabIndex={0}
        >
          {children}
        </main>
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
          class="-mb-px px-2.5 font-medium leading-none rounded-md hover:bg-grayDefault"
          href={`${entries[key]}@${version}`}
        >
          <div
            class={tw`pt-2 ${
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
