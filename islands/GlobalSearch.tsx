// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import type { ComponentChildren } from "preact";
import algoliasearch from "$algolia";
import type {
  MultipleQueriesQuery,
  SearchResponse,
} from "$algolia/client-search";
import { createFetchRequester } from "$algolia/requester-fetch";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "twind";
import { css } from "twind/css";
import { useEffect, useRef, useState } from "preact/hooks";
import * as Icons from "@/components/Icons.tsx";
import { islandSearchClick } from "@/utils/search_insights_utils.ts";

// Lazy load a <dialog> polyfill.
// @ts-expect-error HTMLDialogElement is not just a type!
if (IS_BROWSER && window.HTMLDialogElement === "undefined") {
  await import(
    "https://raw.githubusercontent.com/GoogleChrome/dialog-polyfill/5033aac1b74c44f36cde47be3d11f4756f3f8fda/dist/dialog-polyfill.esm.js"
  );
}

const MODULE_INDEX = "modules";
const MANUAL_INDEX = "manual";

const kinds = [
  "All",
  "Manual",
  "Modules",
] as const;

type SearchKinds = typeof kinds[number];

interface ManualSearchResult {
  docPath: string;
  hierarchy: Record<string, string>;
  anchor: string;
  content: string;
}

interface ModuleSearchResult {
  name: string;
  description?: string;
}

interface SearchResults<ResultItem> {
  queryID?: string;
  hits: (ResultItem & { objectID: string })[];
  hitsPerPage: number;
  page: number;
}

interface Results {
  manual?: SearchResults<ManualSearchResult>;
  modules?: SearchResults<ModuleSearchResult>;
}

function toSearchResults<ResultItem>(
  // deno-lint-ignore no-explicit-any
  response: SearchResponse<any>[],
  index: string,
): SearchResults<ResultItem> | undefined {
  const result = response.find((res) => res.index === index);
  if (result) {
    const { queryID, hits, hitsPerPage, page } = result;
    return { queryID, hits, hitsPerPage, page };
  }
}

function getPosition(results: SearchResults<unknown>, index: number): number {
  return (results.hitsPerPage * results.page) + index + 1;
}

const requester = createFetchRequester();
const client = algoliasearch("QFPCRZC6WX", "2ed789b2981acd210267b27f03ab47da", {
  requester,
});

const defaultResult: Results = {
  manual: {
    hits: [
      {
        hierarchy: {
          lvl0: "Introduction",
        },
        anchor: "introduction",
        content:
          "Deno ( /ˈdiːnoʊ/ , pronounced  dee-no ) is a JavaScript, TypeScript, and WebAssembly runtime with secure defaults and a great developer experience.",
        docPath: "/manual/introduction",
        objectID: "/manual/introduction-1",
      },
      {
        hierarchy: {
          lvl0: "Introduction",
          lvl1: "Philosophy",
        },
        anchor: "philosophy",
        content:
          "Deno aims to be a productive and secure scripting environment for the modern programmer.",
        docPath: "/manual/introduction",
        objectID: "/manual/introduction-4",
      },
      {
        hierarchy: {
          lvl0: "Linking to External Code",
          lvl1: "Integrity Checking",
          lvl2: "Integrity Checking & Lock Files",
          lvl3: "Introduction",
        },
        anchor: "introduction",
        content:
          "Let's say your module depends on remote module  https://some.url/a.ts . When you compile your module for the first time  a.ts  is retrieved, compiled and cached. It will remain this way until you run your module on a new machine (say in production) or reload the cache (through  deno cache --reload  for example). But what happens if the content in the remote url  https://some.url/a.ts  is changed? This could lead to your production module running with different dependency code than your local module. Deno's solution to avoid this is to use integrity checking and lock files.",
        docPath: "/manual/linking_to_external_code/integrity_checking",
        objectID: "/manual/linking_to_external_code/integrity_checking-2",
      },
    ],
    hitsPerPage: 5,
    page: 0,
    queryID: "272178dd9aba9cfd7b4ee37bec7480ef",
  },

  modules: {
    hits: [
      {
        description: "Deno standard library",
        name: "std",
        objectID: "std",
      },
      {
        name: "std/wasi",
        objectID: "std/wasi",
      },
      {
        description:
          "Generators and validators for UUIDs for versions v1, v4 and v5.",
        name: "std/uuid",
        objectID: "std/uuid",
      },
      {
        description:
          "**Deprecated**. Use `TextLineStream` from `std/steams` for line-by-line text reading instead.",
        name: "std/textproto",
        objectID: "std/textproto",
      },
      {
        name: "std/testing",
        objectID: "std/testing",
      },
    ],
    hitsPerPage: 5,
    page: 0,
    queryID: "956a1d1b7da52478637d695df50a4abd",
  },
};

/** Search Deno documentation or modules. */
export default function GlobalSearch() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");

  const [results, setResults] = useState<Results | null>(defaultResult);
  const [kind, setKind] = useState<SearchKinds>("All");
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const searchTimeoutId = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [macintosh, setMacintosh] = useState(true);

  useEffect(() => {
    const keyboardHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) setShowModal(false);
      if (e.target !== document.body) {
        return;
      }
      if (((e.metaKey || e.ctrlKey) && e.key === "k") || e.key === "/") {
        e.preventDefault();
        setShowModal(true);
      }
    };
    globalThis.addEventListener("keydown", keyboardHandler);
    return function cleanup() {
      globalThis.removeEventListener("keydown", keyboardHandler);
    };
  });

  useEffect(() => {
    if (!showModal) return;

    if (input === "") {
      switch (kind) {
        case "Manual": {
          setResults({
            manual: defaultResult.manual,
          });

          return;
        }
        case "All": {
          setResults(defaultResult);

          return;
        }
      }
    }

    setLoading(true);
    if (searchTimeoutId.current === null) {
      searchTimeoutId.current = setTimeout(
        () => setResults(defaultResult),
        500,
      );
    }

    const queries: MultipleQueriesQuery[] = [];

    if (kind === "Manual" || kind === "All") {
      queries.push({
        indexName: MANUAL_INDEX,
        query: input || "Introduction",
        params: {
          page: page,
          hitsPerPage: kind === "All" ? 5 : 10,
          clickAnalytics: true,
          filters: "kind:paragraph",
        },
      });
    }

    if (kind === "Modules" || kind === "All") {
      queries.push({
        indexName: MODULE_INDEX,
        query: input,
        params: {
          page: page,
          hitsPerPage: kind === "All" ? 5 : 10,
          clickAnalytics: true,
        },
      });
    }

    let cancelled = false;

    client.multipleQueries(queries).then(
      ({ results }) => {
        // Ignore results from previous queries
        if (cancelled) return;
        if (searchTimeoutId.current !== null) {
          clearTimeout(searchTimeoutId.current);
          searchTimeoutId.current = null;
        }
        setTotalPages(results.find((res) => res.nbPages)?.nbPages ?? 1);
        setResults({
          manual: toSearchResults(results, MANUAL_INDEX),
          modules: toSearchResults(results, MODULE_INDEX),
        });
        setLoading(false);
      },
    );

    return () => cancelled = true;
  }, [showModal, input, kind, page]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
      document.getElementById("search-input")?.focus();
    } else {
      document.body.style.overflow = "initial";
    }
  }, [showModal]);

  useEffect(() => {
    setMacintosh(window.navigator.platform.includes("Mac"));
  }, []);

  return (
    <>
      <button
        class="pl-4 bg-azure3 flex-grow lg:(w-80 flex-none) rounded-md text-default hover:bg-azure2 disabled:invisible"
        onClick={() => setShowModal(true)}
        disabled={!IS_BROWSER}
      >
        <div class="flex items-center pointer-events-none">
          <Icons.MagnifyingGlass />
          <div class="ml-1.5 py-2.5 h-9 flex-auto text-sm leading-4 font-medium text-left">
            Search...
          </div>
          <div class="mx-4">
            {macintosh ? <div>⌘ K</div> : <div>Ctrl K</div>}
          </div>
        </div>
      </button>

      {IS_BROWSER && (
        <dialog
          class="bg-[#00000033] inset-0 fixed z-50 p-0 m-0 w-full h-screen"
          ref={dialog}
          onClick={() => setShowModal(false)}
          open={showModal}
        >
          <div
            class="bg-white w-full h-screen flex flex-col overflow-hidden lg:(mt-24 mx-auto rounded-md w-2/3 max-h-[80vh] border border-[#E8E7E5])"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="pt-6 px-6 border-b border-[#E8E7E5]">
              <div class="flex">
                <label
                  class={tw`px-4 h-10 w-full flex-shrink-1 bg-grayDefault rounded-md flex items-center placeholder:text-gray-400 focus-within:${
                    css({
                      "outline": "solid",
                    })
                  }`}
                >
                  <Icons.MagnifyingGlass />
                  <input
                    id="search-input"
                    class="ml-1.5 py-3 leading-4 bg-transparent w-full placeholder:text-gray-400 outline-none"
                    type="text"
                    onInput={(e) => setInput(e.currentTarget.value)}
                    value={input}
                    placeholder="Search manual and modules..."
                    autoFocus
                  />
                  {loading && <Icons.Spinner />}
                </label>

                <button
                  class="lg:hidden ml-3 -mr-2 flex items-center"
                  onClick={() => setShowModal(false)}
                >
                  <Icons.Cross />
                </button>
              </div>

              <div class="flex gap-3 mt-2">
                {kinds.map((k) => (
                  <button
                    class={tw`px-2 rounded-md leading-relaxed hover:(bg-grayDefault) ${
                      // TODO: use border instead
                      k === kind
                        ? css({
                          "text-decoration-line": "underline",
                          "text-underline-offset": "6px",
                          "text-decoration-thickness": "2px",
                        })
                        : ""} ${k === kind ? "text-default" : "text-gray-500"}`}
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

            <div class="overflow-y-auto flex-grow-1">
              {results
                ? (
                  <>
                    {results.manual && (
                      <Section title="Manual" isAll={kind === "All"}>
                        {results.manual && results.manual.hits.length === 0 && (
                          <div class="text-gray-500 italic">
                            Your search did not yield any results in the manual.
                          </div>
                        )}
                        {results.manual.hits.map((res, i) => (
                          <ManualResult
                            {...res}
                            queryID={results.manual!.queryID}
                            position={getPosition(results.manual!, i)}
                          />
                        ))}
                      </Section>
                    )}
                    {results.modules && (
                      <Section title="Modules" isAll={kind === "All"}>
                        {results.modules && results.modules.hits.length === 0 &&
                          (
                            <div class="text-gray-500 italic">
                              Your search did not yield any results in the
                              modules index.
                            </div>
                          )}
                        {results.modules.hits.map((module, i) => (
                          <ModuleResult
                            module={module}
                            queryID={results.modules!.queryID}
                            position={getPosition(results.modules!, i)}
                          />
                        ))}
                      </Section>
                    )}
                    <div class={tw`${kind === "All" ? "h-6" : "h-3.5"}`} />
                  </>
                )
                : (
                  <div class="w-full h-full flex justify-center items-center gap-1.5 text-gray-400">
                    <Icons.Spinner />
                    <span>Searching...</span>
                  </div>
                )}
            </div>

            {kind !== "All" && results && (
              <div class="bg-ultralight border-t border-[#E8E7E5] py-3 px-6 flex items-center justify-between">
                <div class="py-2 flex items-center space-x-3">
                  <button
                    class="p-1 border border-border rounded-md not-disabled:hover:bg-border disabled:(text-[#D2D2DC] cursor-not-allowed)"
                    onClick={() => setPage((page) => page - 1)}
                    disabled={page === 0}
                  >
                    <Icons.ChevronLeft />
                  </button>
                  <span class="text-gray-400">
                    Page <span class="font-medium">{page + 1}</span> of{" "}
                    <span class="font-medium">{totalPages}</span>
                  </span>
                  <button
                    class="p-1 border border-border rounded-md not-disabled:hover:bg-border disabled:(text-[#D2D2DC] cursor-not-allowed)"
                    onClick={() => setPage((page) => page + 1)}
                    disabled={(page + 1) === totalPages}
                  >
                    <Icons.ChevronRight />
                  </button>
                </div>
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
    <div class="pt-3">
      {isAll && (
        <div class="mx-6 my-1 text-gray-400 text-sm leading-6 font-semibold">
          {title}
        </div>
      )}
      <div class="children:(flex items-center gap-4 px-6 py-1.5 hover:bg-ultralight even:(bg-ultralight hover:bg-border))">
        {children}
      </div>
    </div>
  );
}

function ManualResult(
  { hierarchy, docPath, anchor, content, objectID, queryID, position }:
    & ManualSearchResult
    & {
      objectID: string;
      queryID?: string;
      position?: number;
    },
) {
  const title = Object.values(hierarchy).filter(Boolean);
  return (
    <a
      href={`${docPath}#${anchor}`}
      onClick={() =>
        islandSearchClick(MANUAL_INDEX, queryID, objectID, position)}
    >
      <div class="p-1.5 rounded-full bg-gray-200">
        <Icons.Docs />
      </div>
      <div>
        <ManualResultTitle title={title} />
        <div class="text-sm text-[#6C6E78] max-h-10 overflow-ellipsis overflow-hidden">
          {content}
        </div>
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
  return <div class="space-x-1">{parts}</div>;
}

function ModuleResult(
  { module, queryID, position }: {
    module: ModuleSearchResult & { objectID: string };
    queryID?: string;
    position?: number;
  },
) {
  return (
    <a
      href={`https://deno.land/x/${module.name}`}
      onClick={() =>
        islandSearchClick(MODULE_INDEX, queryID, module.objectID, position)}
    >
      <div class="p-1.5 rounded-full bg-gray-200">
        <Icons.Module />
      </div>
      <div>
        <div class="font-semibold">{module.name}</div>
        <div class="text-sm text-[#6C6E78] max-h-10 overflow-ellipsis overflow-hidden">
          {module.description}
        </div>
      </div>
    </a>
  );
}
