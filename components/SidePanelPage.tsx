// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { type ComponentChildren, Fragment, h } from "preact";
import { tw } from "@twind";
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
            class={tw`hidden checked:siblings:last-child:children:first-child:flex checked:sibling:(border-0 children:children:first-child:rotate-90)`}
            autoComplete="off"
          />

          <label
            htmlFor="SidePanelToggle"
            class={tw`lg:hidden block pl-5 py-2.5 font-medium border-b border-border`}
          >
            <div class={tw`flex gap-2 items-center px-1.5`}>
              <Icons.ChevronRight class="text-gray-400" />
              Menu
            </div>
          </label>
        </>
      )}

      <div
        class={tw`flex flex-col mt-0 mb-16 lg:(flex-row mt-12 gap-12 section-x-inset-xl)`}
      >
        {sidepanel && (
          <div
            class={tw`hidden pb-2 w-full border-b border-border lg:(pb-0 border-none block w-72 flex-shrink-0)`}
          >
            <div
              class={tw`w-full space-y-4 section-x-inset-xl lg:section-x-inset-none`}
            >
              {sidepanel}
            </div>
          </div>
        )}

        <main
          class={tw`focus:outline-none w-full flex flex-col section-x-inset-xl mt-7 lg:(section-x-inset-none mt-0)`}
          tabIndex={0}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
