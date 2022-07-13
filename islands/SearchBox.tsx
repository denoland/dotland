// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { ComponentChildren, Fragment, h } from "preact";
import algoliasearch from "$algolia";
import { css, tw } from "@twind";
import { useEffect, useState } from "preact/hooks";
import * as Icons from "@/components/Icons.tsx";
import { InlineCode } from "@/components/InlineCode.tsx";
import type { DocNode } from "$deno_doc/types.d.ts";

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
export default function SearchBox() {
  const [showModal, setShowModal] = useState(true);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{
    manual?: Array<{
      name: string;
      url: string;
      description: string;
    }>;
    modules?: Array<{
      name: string;
      url: string;
      description: string;
    }>;
    symbols?: Array<{
      kind: string;
      name: ComponentChildren;
      url: string;
      description?: string;
    }>;
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
    document.getElementById("searchModal")!.style.display = showModal
      ? "flex"
      : "none";
  }, [showModal]);

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
      // deno-lint-ignore no-explicit-any
      ({ results }: { results: { index: string; hits: any }[] }) => {
        setResults({
          manual: results.find((res: { index: string }) =>
            res.index === "deno_manual"
          )?.hits.map((
            hit: {
              anchor: string;
              url: string;
              content: string;
            },
          ) => ({
            name: hit.anchor,
            url: hit.url,
            description: hit.content,
          })),
          symbols: results.find((res: { index: string }) =>
            res.index === "deno_modules"
          )?.hits.map(
            (hit: DocNode) => {
              let location = new URL(hit.location.filename).pathname;
              location = location.replace(/^(\/x\/)|\//, "");
              return {
                kind: hit.kind,
                name: (
                  <span>
                    {hit.kind} <InlineCode>{hit.name}</InlineCode> from{" "}
                    <span class={tw`text-blue-500 text-sm break-all`}>
                      {location}
                    </span>
                  </span>
                ),
                url: hit.location.filename,
                description: hit.jsDoc?.doc,
              };
            },
          ),
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

      <div
        id="searchModal"
        class={tw
          `hidden justify-center items-center bg-[#999999BF] inset-0 fixed z-10`}
        onClick={() => setShowModal(false)}
      >
        <div
          class={tw
            `bg-[#F3F3F3] shadow-xl p-3 h-screen w-screen lg:(rounded-md h-3/4 w-2/3) flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          <div class={tw`flex-shrink-0 flex`}>
            <label
              class={tw
                `text-xl flex bg-white border border-dark-border rounded-md p-2 w-full`}
            >
              <Icons.MagnifyingGlass class="w-10! h-10! text-main" />
              <input
                type="text"
                onInput={(e) => setInput(e.currentTarget.value)}
                value={input}
                class={tw`w-full ml-3 bg-transparent`}
                placeholder="Search manual, symbols, and modules"
              />
            </label>
            <button
              class={tw`lg:hidden pl-2`}
              onClick={() => setShowModal(false)}
            >
              <Icons.Cross />
            </button>
          </div>

          <div class={tw`flex gap-3 ml-2 mt-3 mb-2 flex-shrink-0`}>
            {kinds.map((k) => (
              <div
                class={tw
                  `px-2 rounded-md leading-loose hover:(bg-gray-200 text-main) ${
                    k === kind
                      ? css({
                        "text-decoration-line": "underline",
                        "text-underline-offset": "6px",
                        "text-decoration-thickness": "2px",
                      })
                      : ""
                  } ${k === kind ? "text-black" : "text-gray-500"}`}
                onClick={() => setKind(k)}
              >
                {k}
              </div>
            ))}
          </div>
          {kind === "Symbols" &&
            (
              <div class={tw`flex mb-1.5 gap-1 flex-col lg:(gap-3 flex-row)`}>
                {(Object.keys(symbolKinds) as (keyof typeof symbolKinds)[]).map(
                  (symbolKind) => (
                    <label>
                      <input
                        type="checkbox"
                        class={tw`mr-1`}
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
                      {symbolKind}
                    </label>
                  ),
                )}
              </div>
            )}
          <hr />

          <div class={tw`mt-4 space-y-4 overflow-y-auto flex-grow`}>
            {results.manual && (
              <Section title="Manual" isAll={kind === "All"}>
                {results.manual.map((res) => <Result {...res} />)}
              </Section>
            )}
            {results.symbols && (
              <Section title="Symbols" isAll={kind === "All"}>
                {results.symbols.map((res) => <Result {...res} />)}
              </Section>
            )}
          </div>
        </div>
      </div>
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
    <div>
      {isAll && <div class={tw`ml-1.5 mb-2`}>{title}</div>}
      <div class={tw`space-y-2`}>
        {children}
      </div>
    </div>
  );
}

function Result({
  url,
  name,
  description,
}: { name: ComponentChildren; url: string; description?: ComponentChildren }) {
  return (
    <a
      href={url}
      class={tw`block bg-white border border-dark-border rounded-md p-2`}
    >
      <span class={tw`text-lg font-semibold`}>{name}</span>
      {description && <div class={tw`truncate`}>{description}</div>}
    </a>
  );
}
