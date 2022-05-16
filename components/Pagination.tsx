// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */

import { ComponentProps, Fragment, h, tw } from "../deps.ts";
import { PaginationProps } from "../util/pagination_utils.ts";
import { SearchResult } from "../util/registry_utils.ts";

interface Props extends PaginationProps {
  query?: string;
  response: {
    results: SearchResult[];
    totalCount: number;
  };
}

function getNavButtonStyles(disabled: boolean) {
  return `relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md bg-white ${
    !disabled
      ? "text-gray-700 hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700"
      : "text-gray-500 cursor-default"
  } transition ease-in-out duration-150`;
}

export function Pagination(
  { query, hasNext, hasPrevious, currentPage, pageCount, perPage, response }:
    Props,
) {
  const centerPage = Math.max(
    4,
    Math.min(currentPage, pageCount - 3),
  );

  function toPage(n: number): string {
    const params = new URLSearchParams();
    if (query) {
      params.set("query", query);
    }
    params.set("page", n.toString());
    return "/x?" + params.toString();
  }

  return (
    <div
      class={tw
        `bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6`}
    >
      {!query
        ? (
          <>
            <div class={tw`flex-1 flex justify-between items-center sm:hidden`}>
              <MaybeA
                disabled={!hasPrevious}
                href={toPage(currentPage - 1)}
                class={getNavButtonStyles(!hasPrevious)}
              >
                Previous
              </MaybeA>
              <div class={tw`text-base leading-6 text-gray-500`}>
                {currentPage}/{pageCount}
              </div>
              <MaybeA
                disabled={!hasNext}
                href={toPage(currentPage + 1)}
                class={tw`${getNavButtonStyles(!hasNext)} ml-4`}
              >
                Next
              </MaybeA>
            </div>
            <div
              class={tw
                `hidden sm:flex-1 sm:flex sm:items-center sm:justify-between`}
            >
              <div>
                <p class={tw`text-sm leading-5 text-gray-700`}>
                  Showing{" "}
                  <span class={tw`font-medium`}>
                    {(currentPage - 1) * perPage + 1}
                  </span>{" "}
                  to{" "}
                  <span class={tw`font-medium`}>
                    {(currentPage - 1) * perPage + response.results.length}
                  </span>{" "}
                  of{" "}
                  <span class={tw`font-medium`}>
                    {response.totalCount}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav class={tw`relative z-0 inline-flex shadow-sm`}>
                  <MaybeA
                    disabled={!hasPrevious}
                    href={toPage(currentPage - 1)}
                    class={tw
                      `relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium ${
                        hasPrevious
                          ? "text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500"
                          : "text-gray-300 cursor-default"
                      } transition ease-in-out duration-150`}
                    aria-label="Previous"
                  >
                    <svg
                      class={tw`h-5 w-5`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </MaybeA>
                  <a
                    href={toPage(1)}
                    class={tw
                      `inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                        currentPage === 1
                          ? "bg-gray-100 font-semibold text-gray-800"
                          : "bg-white font-medium text-gray-700"
                      } hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                  >
                    1
                  </a>
                  {centerPage === 4
                    ? (
                      <>
                        <a
                          href={toPage(2)}
                          class={tw
                            `hidden md:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                              currentPage === 2
                                ? "bg-gray-100 font-semibold text-gray-800"
                                : "bg-white font-medium text-gray-700"
                            } hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                        >
                          2
                        </a>
                        <span
                          class={tw
                            `inline-flex md:hidden -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700`}
                        >
                          ...
                        </span>
                      </>
                    )
                    : (
                      <span
                        class={tw
                          `-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700`}
                      >
                        ...
                      </span>
                    )}
                  <a
                    href={toPage(centerPage - 1)}
                    class={tw
                      `hidden md:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                        currentPage === centerPage - 1
                          ? "bg-gray-100 font-semibold text-gray-800"
                          : "bg-white font-medium text-gray-700"
                      } hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                  >
                    {centerPage - 1}
                  </a>
                  <a
                    href={toPage(centerPage)}
                    class={tw
                      `inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                        currentPage === centerPage
                          ? "bg-gray-100 font-semibold text-gray-800"
                          : "bg-white font-medium text-gray-700"
                      } hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                  >
                    {centerPage}
                  </a>
                  <a
                    href={toPage(centerPage + 1)}
                    class={tw
                      `hidden md:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                        currentPage === centerPage + 1
                          ? "bg-gray-100 font-semibold text-gray-800"
                          : "bg-white font-medium text-gray-700"
                      } hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                  >
                    {centerPage + 1}
                  </a>
                  {centerPage === pageCount - 3
                    ? (
                      <>
                        <a
                          href={toPage(pageCount - 1)}
                          class={tw
                            `hidden md:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                              currentPage === pageCount - 1
                                ? "bg-gray-100 font-semibold text-gray-800"
                                : "bg-white font-medium text-gray-700"
                            } hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                        >
                          {pageCount - 1}
                        </a>
                        <span
                          class={tw
                            `inline-flex md:hidden -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700`}
                        >
                          ...
                        </span>
                      </>
                    )
                    : (
                      <span
                        class={tw
                          `-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700`}
                      >
                        ...
                      </span>
                    )}
                  <a
                    href={toPage(pageCount)}
                    class={tw
                      `inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                        currentPage === pageCount
                          ? "bg-gray-100 font-semibold text-gray-800"
                          : "bg-white font-medium text-gray-700"
                      } hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                  >
                    {pageCount}
                  </a>
                  <MaybeA
                    href={toPage(currentPage + 1)}
                    disabled={!hasNext}
                    class={tw
                      `-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium ${
                        hasNext
                          ? "text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500"
                          : "text-gray-300 cursor-default"
                      } transition ease-in-out duration-150`}
                    aria-label="Previous"
                  >
                    <svg
                      class={tw`h-5 w-5`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </MaybeA>
                </nav>
              </div>
            </div>
          </>
        )
        : (
          <div className="flex flex-1 justify-center">
            <MaybeA
              disabled={false}
              href={toPage(currentPage + 1)}
              class={getNavButtonStyles(false)}
            >
              Next
            </MaybeA>
          </div>
        )}
    </div>
  );
}

function MaybeA(
  props:
    | ({ disabled: true } & ComponentProps<"div">)
    | ({ disabled: false } & ComponentProps<"a">),
) {
  if (props.disabled) {
    return <div {...props} />;
  } else {
    return <a {...props} />;
  }
}
