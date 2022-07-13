// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { runtime } from "$doc_components/services.ts";
import algoliasearch from "$algolia";
import { css, tw } from "@twind";
import { useEffect, useState } from "preact/hooks";
import * as Icons from "@/components/Icons.tsx";
import type { DocNode } from "$deno_doc/types.d.ts";
import { colors, docNodeKindMap } from "$doc_components/symbol_kind.tsx";
import { ComponentChildren } from "preact";

const kinds = [
  "All",
  "Manual",
  //"Modules",
  "Symbols",
] as const;

const symbolKinds = {
  "Namespaces": "namespace",
  "Classes": "class",
  "Enums": "enum",
  "Variables": "variable",
  "Functions": "function",
  "Interfaces": "interface",
  "Type Aliases": "typeAlias",
} as const;

/** Search Deno documentation, symbols, or modules. */
export default function GlobalSearch() {
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{
    manual?: Array<{
      anchor: string;
      url: string;
      content: string;
    }>;
    modules?: Array<unknown>;
    symbols?: Array<DocNode>;
  }>({});
  const [kind, setKind] = useState<typeof kinds[number]>("All");
  const [symbolKindsToggle, setSymbolKindsToggle] = useState<
    Record<(keyof typeof symbolKinds), boolean>
  >({
    "Namespaces": true,
    "Classes": true,
    "Enums": true,
    "Variables": true,
    "Functions": true,
    "Interfaces": true,
    "Type Aliases": true,
  });

  const client = algoliasearch(
    "QFPCRZC6WX",
    "2ed789b2981acd210267b27f03ab47da",
  );

  useEffect(() => {
    const keyboardHandler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "k") {
        e.preventDefault();
        setShowModal(true);
      }
      if (e.key === "Escape") {
        console.log("escape pressed");
        setShowModal(false);
      }
    };
    globalThis.addEventListener("keydown", keyboardHandler);
    return function cleanup() {
      globalThis.removeEventListener("keydown", keyboardHandler);
    };
  });

  useEffect(() => {
    const queries = [];

    if (kind === "Manual" || kind === "All") {
      queries.push({
        indexName: "deno_manual",
        query: input,
        params: {
          hitsPerPage: kind === "All" ? 5 : 10,
        },
      });
    }

    if (kind === "Symbols" || kind === "All") {
      queries.push({
        indexName: "deno_modules",
        query: input,
        params: {
          hitsPerPage: kind === "All" ? 5 : 10,
          filters: Object.entries(symbolKindsToggle)
            .filter(([_, v]) => kind === "Symbols" ? v : true)
            .map(([k]) => "kind:" + symbolKinds[k as keyof typeof symbolKinds])
            .join(" OR "),
        },
      });
    }

    client.multipleQueries(queries).then(
      ({ results }) => {
        setResults({
          // @ts-ignore algolia typings are annoying
          manual: results.find((res) => res.index! === "deno_manual")?.hits,
          // @ts-ignore algolia typings are annoying
          symbols: results.find((res) => res.index! === "deno_modules")?.hits,
        });
      },
    );
  }, [input, kind, symbolKindsToggle]);

  return (
    <>
      <button
        class={tw
          `pl-4 w-80 bg-[#F3F3F3] flex-auto lg:flex-none rounded-md text-light`}
        onClick={() => setShowModal(true)}
      >
        <div class={tw`flex items-center pointer-events-none`}>
          <Icons.MagnifyingGlass />
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

      {showModal && (
        <div
          class={tw`bg-[#00000033] inset-0 fixed z-10`}
          onClick={() => setShowModal(false)}
        >
          <div
            class={tw
              `bg-white w-full h-screen lg:(mt-24 mx-auto rounded-md w-2/3 max-h-[80vh] border border-[#E8E7E5]) flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            <div class={tw`pt-6 px-6 border-b border-[#E8E7E5]`}>
              <div class={tw`flex`}>
                <label
                  class={tw
                    `pl-4 h-10 w-full bg-[#F3F3F3] rounded-md flex items-center text-light`}
                >
                  <Icons.MagnifyingGlass />
                  <input
                    class={tw`ml-1.5 py-3 leading-4 bg-transparent w-full`}
                    type="text"
                    onInput={(e) => setInput(e.currentTarget.value)}
                    value={input}
                    placeholder="Search manual, symbols and modules..."
                  />
                </label>

                <div
                  class={tw`lg:hidden ml-3 -mr-2 flex items-center`}
                  onClick={() => setShowModal(false)}
                >
                  <Icons.Cross />
                </div>
              </div>

              <div class={tw`flex gap-3 mt-2`}>
                {kinds.map((k) => (
                  <div
                    class={tw
                      `px-2 rounded-md leading-relaxed hover:(bg-gray-100 text-main) ${
                        // TODO: use border instead
                        k === kind
                          ? css({
                            "text-decoration-line": "underline",
                            "text-underline-offset": "6px",
                            "text-decoration-thickness": "2px",
                          })
                          : ""} ${k === kind ? "text-black" : "text-gray-500"}`}
                    onClick={() => setKind(k)}
                  >
                    {k}
                  </div>
                ))}
              </div>
            </div>

            <div class={tw`overflow-y-auto`}>
              {results.manual && (
                <Section title="Manual" isAll={kind === "All"}>
                  {results.manual.map((res) => <ManualResult {...res} />)}
                </Section>
              )}
              {results.symbols && (
                <Section title="Symbols" isAll={kind === "All"}>
                  {results.symbols.map((doc) => <SymbolResult doc={doc} />)}
                </Section>
              )}
              <div class={tw`${kind === "All" ? "h-6" : "h-3.5"}`} />
            </div>

            {kind === "Symbols" &&
              (
                <div
                  class={tw
                    `bg-ultralight border-t border-[#E8E7E5] py-5 px-6 space-x-3`}
                >
                  {(Object.keys(symbolKinds) as (keyof typeof symbolKinds)[])
                    .map(
                      (symbolKind) => (
                        <label class={tw`whitespace-nowrap inline-block`}>
                          <input
                            type="checkbox"
                            class={tw`mr-1 not-checked:siblings:text-[#6C6E78]`}
                            onChange={() => {
                              console.log(symbolKindsToggle);
                              setSymbolKindsToggle((prev) => {
                                return {
                                  ...prev,
                                  [symbolKind]: !prev[symbolKind],
                                };
                              });
                            }}
                            checked={symbolKindsToggle[symbolKind]}
                          />
                          <span class={tw`text-sm leading-none`}>
                            {symbolKind}
                          </span>
                        </label>
                      ),
                    )}
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
}

function Section({
  title,
  isAll,
  children,
}: {
  title: string;
  isAll: boolean;
  children: ComponentChildren;
}) {
  return (
    <div class={tw`pt-3`}>
      {isAll && (
        <div
          class={tw`mx-6 my-1 text-[#9CA0AA] text-sm leading-6 font-semibold`}
        >
          {title}
        </div>
      )}
      <div class={tw`children:(px-6 py-1.5 even:bg-ultralight)`}>
        {children}
      </div>
    </div>
  );
}

function ManualResult({
  anchor,
  url,
  content,
}: { anchor: string; url: string; content: string }) {
  return (
    <a href={url} class={tw`block`}>
      <div class={tw`font-semibold`}>
        {anchor}
      </div>
      <div class={tw`text-sm text-[#6C6E78]`}>
        {content}
      </div>
    </a>
  );
}

function SymbolResult({ doc }: { doc: DocNode }) {
  let location = new URL(doc.location.filename).pathname;
  location = location.replace(/^(\/x\/)|\//, "");
  const KindIcon = docNodeKindMap[doc.kind];

  return (
    <a href={doc.location.filename} class={tw`flex items-center`}>
      <KindIcon />
      <div class={tw`ml-2`}>
        <div class={tw`space-x-2 py-1`}>
          <span class={tw`text-[${colors[doc.kind][0]}]`}>{doc.kind}</span>
          <span class={tw`font-semibold`}>{doc.name}</span>
          <span class={tw`italic text-sm text-[#9CA0AA] leading-6`}>from</span>
          <span>{location}</span>
        </div>
        {doc.jsDoc?.doc && (
          <div
            class={tw
              `text-sm text-[#6C6E78] h-5 overflow-ellipsis overflow-hidden mr-24`}
          >
            {doc.jsDoc!.doc}
          </div>
        )}
      </div>
    </a>
  );
}
