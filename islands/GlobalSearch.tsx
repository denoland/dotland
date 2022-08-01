// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import algoliasearch from "$algolia";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { css, tw } from "@twind";
import { useEffect, useState } from "preact/hooks";
import * as Icons from "@/components/Icons.tsx";
import type { DocNode } from "$deno_doc/types.d.ts";
import { colors, docNodeKindMap } from "@/components/symbol_kind.tsx";
import { ComponentChildren } from "preact";

// Lazy load a <dialog> polyfill.
// @ts-expect-error HTMLDialogElement is not just a type!
if (IS_BROWSER && window.HTMLDialogElement === "undefined") {
  await import(
    "https://raw.githubusercontent.com/GoogleChrome/dialog-polyfill/5033aac1b74c44f36cde47be3d11f4756f3f8fda/dist/dialog-polyfill.esm.js"
  );
}

const kinds = [
  "All",
  "Manual",
  "Modules",
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

interface ManualSearchResult {
  anchor: string;
  hierarchy: Record<string, string>;
  url: string;
  content: string;
}

interface ModuleSearchResult {
  name: string;
  description: string;
}

/** Search Deno documentation, symbols, or modules. */
export default function GlobalSearch() {
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");

  const [results, setResults] = useState<{
    manual?: Array<ManualSearchResult>;
    modules?: Array<ModuleSearchResult>;
    symbols?: Array<DocNode>;
  }>({});
  const [kind, setKind] = useState<typeof kinds[number]>("All");
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
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
      if (e.target !== document.body) {
        return;
      }
      if (((e.metaKey || e.ctrlKey) && e.key === "k") || e.key === "/") {
        e.preventDefault();
        setShowModal(true);
      }
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };
    globalThis.addEventListener("keydown", keyboardHandler);
    return function cleanup() {
      globalThis.removeEventListener("keydown", keyboardHandler);
    };
  });

  useEffect(() => {
    if (!showModal) return;

    const queries = [];

    if (kind === "Manual" || kind === "All") {
      queries.push({
        indexName: "deno_manual",
        query: input || "Introduction",
        params: {
          page: page,
          hitsPerPage: kind === "All" ? 5 : 10,
          attributesToRetrieve: ["anchor", "url", "content", "hierarchy"],
          filters: "type:content",
        },
      });
    }

    if (kind === "Symbols" || kind === "All") {
      queries.push({
        indexName: "deno_modules",
        query: input || "serve",
        params: {
          page: page,
          hitsPerPage: kind === "All" ? 5 : 10,
          filters: Object.entries(symbolKindsToggle)
            .filter(([_, v]) => kind === "Symbols" ? v : true)
            .map(([k]) => "kind:" + symbolKinds[k as keyof typeof symbolKinds])
            .join(" OR "),
        },
      });
    }

    if (kind === "Modules" || kind === "All") {
      queries.push({
        indexName: "modules",
        query: input,
        params: {
          page: page,
          hitsPerPage: kind === "All" ? 5 : 10,
        },
      });
    }

    client.multipleQueries(queries).then(
      ({ results }) => {
        // @ts-ignore algolia typings are annoying
        setTotalPages(results.find((res) => res.nbPages)?.nbPages ?? 1);
        setResults({
          // @ts-ignore algolia typings are annoying
          manual: results.find((res) => res.index === "deno_manual")?.hits,
          // @ts-ignore algolia typings are annoying
          symbols: results.find((res) => res.index === "deno_modules")?.hits,
          // @ts-ignore algolia typings are annoying
          modules: results.find((res) => res.index === "modules")?.hits,
        });
      },
    );
  }, [showModal, input, kind, symbolKindsToggle, page]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
      document.getElementById("search-input")?.focus();
    } else {
      document.body.style.overflow = "initial";
    }
  }, [showModal]);

  return (
    <>
      <button
        class={tw`pl-4 w-80 bg-[#F3F3F3] flex-auto lg:flex-none rounded-md text-light hover:bg-light-border`}
        onClick={() => setShowModal(true)}
        disabled={!IS_BROWSER}
      >
        <div class={tw`flex items-center pointer-events-none`}>
          <Icons.MagnifyingGlass />
          <div
            class={tw`ml-1.5 py-2.5 h-9 flex-auto text-light text-sm leading-4 font-medium text-left`}
          >
            Search...
          </div>
          <div class={tw`mx-4`}>
            ⌘K
          </div>
        </div>
      </button>

      {IS_BROWSER && (
        <dialog
          class={tw`bg-[#00000033] inset-0 fixed z-10 p-0 m-0 w-full h-screen`}
          onClick={() => setShowModal(false)}
          open={showModal}
        >
          <div
            class={tw`bg-white w-full h-screen flex flex-col overflow-hidden lg:(mt-24 mx-auto rounded-md w-2/3 max-h-[80vh] border border-[#E8E7E5])`}
            onClick={(e) => e.stopPropagation()}
          >
            <div class={tw`pt-6 px-6 border-b border-[#E8E7E5]`}>
              <div class={tw`flex`}>
                <label
                  class={tw`pl-4 h-10 w-full flex-shrink-1 bg-[#F3F3F3] rounded-md flex items-center text-light focus-within:${
                    css({
                      "outline": "solid",
                    })
                  }`}
                >
                  <Icons.MagnifyingGlass />
                  <input
                    id="search-input"
                    class={tw`ml-1.5 py-3 leading-4 bg-transparent w-full text-main placeholder:text-[#9CA0AA] outline-none`}
                    type="text"
                    onInput={(e) => setInput(e.currentTarget.value)}
                    value={input}
                    placeholder="Search manual, symbols and modules..."
                    autoFocus
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
                  <button
                    class={tw`px-2 rounded-md leading-relaxed hover:(bg-gray-100 text-main) ${
                      // TODO: use border instead
                      k === kind
                        ? css({
                          "text-decoration-line": "underline",
                          "text-underline-offset": "6px",
                          "text-decoration-thickness": "2px",
                        })
                        : ""} ${k === kind ? "text-black" : "text-gray-500"}`}
                    onClick={() => {
                      setKind(k);
                      setPage(0);
                    }}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div class={tw`overflow-y-auto flex-grow-1`}>
              {results.manual && (
                <Section title="Manual" isAll={kind === "All"}>
                  {results.manual && results.manual.length === 0 && (
                    <div class={tw`text-gray-500 italic`}>
                      Your search did not yield any results in the manual.
                    </div>
                  )}
                  {results.manual.map((res) => <ManualResult {...res} />)}
                </Section>
              )}
              {results.modules && (
                <Section title="Modules" isAll={kind === "All"}>
                  {results.modules && results.modules.length === 0 && (
                    <div class={tw`text-gray-500 italic`}>
                      Your search did not yield any results in the modules
                      index.
                    </div>
                  )}
                  {results.modules.map((module) => (
                    <ModuleResult module={module} />
                  ))}
                </Section>
              )}
              {results.symbols && (
                <Section title="Symbols" isAll={kind === "All"}>
                  {results.symbols && results.symbols.length === 0 && (
                    <div class={tw`text-gray-500 italic`}>
                      Your search did not yield any results in the symbol index.
                    </div>
                  )}
                  {results.symbols.map((doc) => <SymbolResult doc={doc} />)}
                </Section>
              )}
              <div class={tw`${kind === "All" ? "h-6" : "h-3.5"}`} />
            </div>

            {kind !== "All" && (
              <div
                class={tw`bg-ultralight border-t border-[#E8E7E5] py-3 px-6 flex items-center justify-between`}
              >
                <div class={tw`py-2 flex items-center space-x-3`}>
                  <button
                    class={tw`p-1 border border-dark-border rounded-md not-disabled:hover:bg-light-border disabled:(text-[#D2D2DC] cursor-not-allowed)`}
                    onClick={() => setPage((page) => page - 1)}
                    disabled={page === 0}
                  >
                    <Icons.ArrowLeft />
                  </button>
                  <span class={tw`text-[#9CA0AA]`}>
                    Page <span class={tw`font-medium`}>{page + 1}</span> of{" "}
                    <span class={tw`font-medium`}>{totalPages}</span>
                  </span>
                  <button
                    class={tw`p-1 border border-dark-border rounded-md not-disabled:hover:bg-light-border disabled:(text-[#D2D2DC] cursor-not-allowed)`}
                    onClick={() => setPage((page) => page + 1)}
                    disabled={(page + 1) === totalPages}
                  >
                    <Icons.ArrowRight />
                  </button>
                </div>

                {kind === "Symbols" &&
                  (
                    <div class={tw`space-x-3`}>
                      {(Object.keys(
                        symbolKinds,
                      ) as (keyof typeof symbolKinds)[])
                        .map(
                          (symbolKind) => (
                            <label class={tw`whitespace-nowrap inline-block`}>
                              <input
                                type="checkbox"
                                class={tw`mr-1 not-checked:siblings:text-[#6C6E78]`}
                                onChange={() => {
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
            )}
          </div>
        </dialog>
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

function ManualResult({ hierarchy, url, content }: ManualSearchResult) {
  const title = [];
  for (const [id, entry] of Object.entries(hierarchy)) {
    if (id === "lvl0" || !entry) continue;
    title.push(entry);
  }
  return (
    <a href={url} class={tw`block`}>
      <div>
        <ManualResultTitle title={title} />
      </div>
      <div
        class={tw`text-sm text-[#6C6E78] max-h-10 overflow-ellipsis overflow-hidden`}
      >
        {content}
      </div>
    </a>
  );
}

function ManualResultTitle(props: { title: string[] }) {
  const parts = [];
  for (const [i, part] of props.title.entries()) {
    const isLast = i === props.title.length - 1;
    parts.push(
      <span class={isLast ? tw`font-semibold` : undefined} key={i}>
        {part}
      </span>,
    );
    if (!isLast) parts.push(<span key={i + "separator"}>{" > "}</span>);
  }
  return <div class={tw`flex gap-1`}>{parts}</div>;
}

function SymbolResult({ doc }: { doc: DocNode }) {
  let location = new URL(doc.location.filename).pathname;
  location = location.replace(/^(\/x\/)|\//, "");
  const KindIcon = docNodeKindMap[doc.kind];
  const href = `${doc.location.filename}?s=${doc.name}`;
  return (
    <a href={href} class={tw`flex items-center gap-4`}>
      <KindIcon />
      <div>
        <div class={tw`space-x-2 py-1`}>
          <span class={tw`text-[${colors[doc.kind][0]}]`}>
            {doc.kind.replace("A", " a")}
          </span>
          <span class={tw`font-semibold`}>{doc.name}</span>
          <span class={tw`italic text-sm text-[#9CA0AA] leading-6`}>from</span>
          <span>{location}</span>
        </div>
        {doc.jsDoc?.doc && (
          <div
            class={tw`text-sm text-[#6C6E78] h-5 overflow-ellipsis overflow-hidden mr-24`}
          >
            {doc.jsDoc.doc.split("\n")[0]}
          </div>
        )}
      </div>
    </a>
  );
}

function ModuleResult({ module }: { module: ModuleSearchResult }) {
  return (
    <a href={`https://deno.land/x/${module.name}`} class={tw`block`}>
      <div class={tw`font-semibold`}>{module.name}</div>
      <div
        class={tw`text-sm text-[#6C6E78] max-h-10 overflow-ellipsis overflow-hidden`}
      >
        {module.description}
      </div>
    </a>
  );
}
