// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";
import algoliasearch from "$algolia";
import { tw } from "twind";
import { useState, useEffect } from "preact/hooks";
import * as Icons from "@/components/Icons.tsx";

/** Search Deno documentation, symbols, or modules. */
export default function SearchBox() {
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const client = algoliasearch("QFPCRZC6WX", "2ed789b2981acd210267b27f03ab47da");
  const index = client.initIndex("deno_modules");

  useEffect(() => {
    index.searchForFacetValues('kind', input, {
      filters: 'kind:function'
    }).then((x)  => {
      console.log(x);
    });
  }, [input]);

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

      <div class={tw`grid place-content-center bg-blue-100 inset-0 absolute z-10`}>
        <div class={tw`bg-[#F3F3F3] rounded-md`}>
          <div class={tw`text-3xl m-2 flex bg-white`}>
            <Icons.MagnifyingGlass class="w-10! h-10!" />
            <input type="text" onInput={(e) => setInput(e.currentTarget.value)} value={input} class={tw`w-80 ml-3 bg-transparent`} placeholder="Search manual, symbols, and modules" />

          </div>

          <div class={tw`m-4`}>
            {results}
          </div>
        </div>
      </div>
    </div>
  );
}
