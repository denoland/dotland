// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";
import { tw } from "twind";
import { useState } from "preact/hooks";
import * as Icons from "@/components/Icons.tsx";

/** Search Deno documentation, symbols, or modules. */
export default function SearchBox() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button
        class={tw
          `pl-4 w-80 bg-[#F3F3F3] flex-auto lg:flex-none rounded-md text-light focus:outline-none`}
        onClick={() => setShowModal(true)}
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
      {showModal &&
        // Overlay of the modal.
        <div class={tw`grid place-content-center bg-blue-100 inset-0 absolute`}>
          <div class={tw`bg-blue-200 rounded-md w-12 h-12`}>
            is it working?
          </div>
        </div>}
    </div>
  );
}
