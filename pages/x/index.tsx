// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import {
  ClassAttributes,
  emojify,
  Fragment,
  h,
  Head,
  PageProps,
  twas,
  useData,
} from "../../deps.ts";

import { Header } from "../../components/Header.tsx";
import { Footer } from "../../components/Footer.tsx";
import { InlineCode } from "../../components/InlineCode.tsx";

import { getStats, listModules } from "../../util/registry_utils.ts";
import * as pageutils from "../../util/pagination_utils.ts";
import { ComponentChildren } from "https://x.lcas.dev/preact@10.5.12/mod.d.ts";

const PER_PAGE = 20;

export default function ThirdPartyRegistryList({ url }: PageProps) {
  const page = parseInt(url.searchParams.get("page") || "1");
  const query = url.searchParams.get("query") || "";

  const resp = useData(
    `${page} ${PER_PAGE} ${query}`,
    () => listModules(page, PER_PAGE, query),
  );
  const stats = useData("stats", getStats);

  function toPage(n: number): string {
    const params = new URLSearchParams();
    if (query) {
      params.set("query", query);
    }
    params.set("page", n.toString());
    return "/x?" + params.toString();
  }

  return (
    <>
      <Head>
        <title>第三方模块 | Deno</title>
      </Head>
<<<<<<< HEAD
      <div className="bg-gray">
        <Header subtitle="第三方模块" widerContent={true} />
        <RegistryInstructions
          isOpen={overlayOpen}
          close={() => setOverlayOpen(false)}
        />
        <div>
          <div className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 mt-8">
            <dt className="text-lg leading-6 font-medium text-gray-900">
              deno.land/x 是什么？
            </dt>
            <dd className="mt-2">
              <p className="text-base leading-6 text-gray-500">
                <span className="font-semibold">deno.land/x</span>是 Deno
                模块的托管服务。它缓存 GitHub 上的开源模块的 Release 代码，并在一个易于记忆的域名中提供它们。
              </p>
            </dd>

            <div className="mt-2">
              <a href="#info" className="link">
                了解更多
=======
      <div class="bg-gray">
        <Header subtitle="Third Party Modules" widerContent={true} />
        <div>
          <div class="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 mt-8">
            <dt class="text-lg leading-6 font-medium text-gray-900">
              What is deno.land/x?
            </dt>
            <dd class="mt-2">
              <p class="text-base leading-6 text-gray-500">
                <span class="font-semibold">deno.land/x</span>{" "}
                is a hosting service for Deno scripts. It caches releases of
                open source modules stored on GitHub and serves them at one easy
                to remember domain.
              </p>
            </dd>

            <div class="mt-2">
              <a href="#info" class="link">
                Learn more
>>>>>>> 536026728193c65673465483c3006267099de405
              </a>
            </div>

            <div class="mt-6">
              <a
                href="/add_module"
                class="
                  py-2 px-8 border border-gray-300 text-md font-medium rounded-md
                  text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50
                  focus:outline-none focus:shadow-outline-blue focus:border-blue-300
                  active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out
                "
              >
                Publish a module
              </a>
            </div>
            {
              /* <div class="mt-8">
              <ErrorMessage title="Ongoing incident">
                We are currently seeing delays and timeouts during module publishing and search. Serving of already published modules and `std` is not affected. We are working on resolving the problem.
              <ErrorMessage />
            </div> */
            }
          </div>
<<<<<<< HEAD
          <div className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 mt-8">
            <label htmlFor="query" className="font-medium sr-only">
              搜索
=======
          <form
            method="get"
            class="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 mt-8"
          >
            <label htmlFor="query" class="font-medium sr-only">
              Search
>>>>>>> 536026728193c65673465483c3006267099de405
            </label>
            <input
              name="query"
              id="query"
              class="block w-full px-4 py-2 leading-normal bg-white border border-gray-200 rounded-lg outline-none shadow hover:shadow-sm focus:shadow-sm appearance-none focus:border-gray-300 hover:border-gray-300 mt-1"
              type="text"
              placeholder={!resp ? "搜索" : `在 ${resp.totalCount} 个模块中搜索`}
              value={query}
            />
          </form>
          <div class="sm:max-w-screen-lg sm:mx-auto sm:px-6 md:px-8 pb-4 sm:pb-12">
            {resp === null
              ? (
<<<<<<< HEAD
                <div className="bg-white sm:shadow border border-gray-200 overflow-hidden sm:rounded-md mt-4">
                  <ul>
                    {Array(20)
                      .fill(null)
                      .map((_, i) => (
                        <li
                          className={i !== 0
                            ? "border-t border-gray-200"
                            : ""}
                          key={i}
                        >
                          <div className="flex items-center px-4 sm:px-6 py-4">
                            <div className="min-w-0 flex-1 flex items-center">
                              <div className="min-w-0 flex-1">
                                <div className="text-sm leading-5">
                                  <div className="h-3 bg-blue-100 w-1/3 sm:w-1/5 md:w-1/6">
                                  </div>
                                </div>
                                <div className="mt-1 flex items-center">
                                  <div className="h-3 bg-gray-100 w-5/6 sm:w-4/5 md:w-3/4">
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="ml-6 mr-4 flex items-center">
                              <div className="h-3 bg-gray-100 w-4"></div>
                              <svg
                                className="ml-1 text-gray-100 w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <title>star</title>
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                </path>
                              </svg>
                            </div>
                            <div>
                              <svg
                                className="h-5 w-5 text-gray-100"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between items-center sm:hidden">
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-gray-100 text-sm leading-5 font-medium rounded-md bg-white">
                        Previous
                      </button>
                      <div className="text-base leading-6 text-gray-500">
                        <div className="h-3 w-4 bg-gray-100 inline-block mr-1" />/
                        <div className="h-3 w-4 bg-gray-100 inline-block ml-1" />
                      </div>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-gray-100 text-sm leading-5 font-medium rounded-md bg-white ml-4">
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="h-3 w-32 bg-gray-100" />
                      <div>
                        <nav className="relative z-0 inline-flex shadow-sm text-gray-200 leading-5">
                          <div className="-ml-px relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white rounded-l-md">
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="-ml-px relative items-center px-4 py-2 border border-gray-300 bg-white hidden md:inline-flex">
                            &nbsp;&nbsp;
                          </div>
                          <div className="-ml-px relative items-center px-4 py-2 border border-gray-300 bg-white hidden md:inline-flex">
                            &nbsp;&nbsp;
                          </div>
                          <div className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white">
                            &nbsp;&nbsp;
                          </div>
                          <div className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white">
                            &nbsp;&nbsp;
                          </div>
                          <div className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white">
                            &nbsp;&nbsp;
                          </div>
                          <div className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white">
                            &nbsp;&nbsp;
                          </div>
                          <div className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white">
                            &nbsp;&nbsp;
                          </div>
                          <div className="-ml-px relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white rounded-r-md">
                            <svg
                              className="h-5 w-5 text-gray-200"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )
              : resp === null
              ? (
                <div className="p-4 text-center sm:text-left text-sm leading-5 font-medium text-gray-500 truncate">
                  加载模块失败
=======
                <div class="p-4 text-center sm:text-left text-sm leading-5 font-medium text-gray-500 truncate">
                  Failed to load modules
>>>>>>> 536026728193c65673465483c3006267099de405
                </div>
              )
              : (
                <div class="bg-white sm:shadow border border-gray-200 overflow-hidden sm:rounded-md mt-4">
                  {resp.results.length == 0
                    ? (
<<<<<<< HEAD
                      <div className="p-4 text-center sm:text-left text-sm leading-5 font-medium text-gray-500 truncate">
                        没有找到模块
=======
                      <div class="p-4 text-center sm:text-left text-sm leading-5 font-medium text-gray-500 truncate">
                        No modules found
>>>>>>> 536026728193c65673465483c3006267099de405
                      </div>
                    )
                    : (
                      <ModuleList
                        modules={resp.results.map((v) => ({
                          ...v,
                          starCount: v.star_count,
                        }))}
                      />
                    )}
                  {!query
                    ? (() => {
                      const pageCount = pageutils.pageCount({
                        totalCount: resp.totalCount,
                        perPage: PER_PAGE,
                      });
                      const hasPrevious = pageutils.hasPrevious({ page });
                      const hasNext = pageutils.hasNext({
                        page,
                        totalCount: resp.totalCount,
                        perPage: PER_PAGE,
                      });
                      const centerPage = Math.max(
                        4,
                        Math.min(page, pageCount - 3),
                      );

                      return (
                        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                          <div class="flex-1 flex justify-between items-center sm:hidden">
                            <MaybeA
                              disabled={!hasPrevious}
                              href={toPage(page - 1)}
                              class={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md bg-white ${
                                hasPrevious
                                  ? "text-gray-700 hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700"
                                  : "text-gray-500 cursor-default"
                              } transition ease-in-out duration-150`}
                            >
<<<<<<< HEAD
                              上一页
                            </button>
                            <div className="text-base leading-6 text-gray-500">
=======
                              Previous
                            </MaybeA>
                            <div class="text-base leading-6 text-gray-500">
>>>>>>> 536026728193c65673465483c3006267099de405
                              {page}/{pageCount}
                            </div>
                            <MaybeA
                              disabled={!hasNext}
                              href={toPage(page + 1)}
                              class={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md bg-white ml-4 ${
                                hasNext
                                  ? "text-gray-700 hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700"
                                  : "text-gray-500 cursor-default"
                              } transition ease-in-out duration-150`}
                            >
<<<<<<< HEAD
                              下一页
                            </button>
=======
                              Next
                            </MaybeA>
>>>>>>> 536026728193c65673465483c3006267099de405
                          </div>
                          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
<<<<<<< HEAD
                              <p className="text-sm leading-5 text-gray-700">
                                显示第{" "}
                                <span className="font-medium">
                                  {(page - 1) * PER_PAGE + 1}
                                </span>{" "}
                                到{" "}
                                <span className="font-medium">
                                  {(page - 1) * PER_PAGE + resp.results.length}
                                </span>
                                ，共{" "}
                                <span className="font-medium">
=======
                              <p class="text-sm leading-5 text-gray-700">
                                Showing{" "}
                                <span class="font-medium">
                                  {(page - 1) * PER_PAGE + 1}
                                </span>{" "}
                                to{" "}
                                <span class="font-medium">
                                  {(page - 1) * PER_PAGE + resp.results.length}
                                </span>{" "}
                                of{" "}
                                <span class="font-medium">
>>>>>>> 536026728193c65673465483c3006267099de405
                                  {resp.totalCount}
                                </span>{" "}
                                个模块
                              </p>
                            </div>
                            <div>
                              <nav class="relative z-0 inline-flex shadow-sm">
                                <MaybeA
                                  disabled={!hasPrevious}
                                  href={toPage(page - 1)}
                                  class={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium ${
                                    hasPrevious
                                      ? "text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500"
                                      : "text-gray-300 cursor-default"
                                  } transition ease-in-out duration-150`}
                                  aria-label="Previous"
                                >
                                  <svg
                                    class="h-5 w-5"
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
                                  class={`inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                                    page === 1
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
                                        class={`hidden md:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                                          page === 2
                                            ? "bg-gray-100 font-semibold text-gray-800"
                                            : "bg-white font-medium text-gray-700"
                                        } hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                                      >
                                        2
                                      </a>
                                      <span class="inline-flex md:hidden -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700">
                                        ...
                                      </span>
                                    </>
                                  )
                                  : (
                                    <span class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700">
                                      ...
                                    </span>
                                  )}
                                <a
                                  href={toPage(centerPage - 1)}
                                  class={`hidden md:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                                    page === centerPage - 1
                                      ? "bg-gray-100 font-semibold text-gray-800"
                                      : "bg-white font-medium text-gray-700"
                                  } hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                                >
                                  {centerPage - 1}
                                </a>
                                <a
                                  href={toPage(centerPage)}
                                  class={`inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                                    page === centerPage
                                      ? "bg-gray-100 font-semibold text-gray-800"
                                      : "bg-white font-medium text-gray-700"
                                  } hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                                >
                                  {centerPage}
                                </a>
                                <a
                                  href={toPage(centerPage + 1)}
                                  class={`hidden md:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                                    page === centerPage + 1
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
                                        class={`hidden md:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                                          page === pageCount - 1
                                            ? "bg-gray-100 font-semibold text-gray-800"
                                            : "bg-white font-medium text-gray-700"
                                        } hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                                      >
                                        {pageCount - 1}
                                      </a>
                                      <span class="inline-flex md:hidden -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700">
                                        ...
                                      </span>
                                    </>
                                  )
                                  : (
                                    <span class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700">
                                      ...
                                    </span>
                                  )}
                                <a
                                  href={toPage(pageCount)}
                                  class={`inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm leading-5 ${
                                    page === pageCount
                                      ? "bg-gray-100 font-semibold text-gray-800"
                                      : "bg-white font-medium text-gray-700"
                                  } hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                                >
                                  {pageCount}
                                </a>
                                <MaybeA
                                  href={toPage(page + 1)}
                                  disabled={!hasNext}
                                  class={`-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium ${
                                    hasNext
                                      ? "text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500"
                                      : "text-gray-300 cursor-default"
                                  } transition ease-in-out duration-150`}
                                  aria-label="Previous"
                                >
                                  <svg
                                    class="h-5 w-5"
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
                        </div>
                      );
                    })()
                    : null}
                </div>
              )}
          </div>
          <div
            id="info"
            class="max-w-screen-xl mx-auto pt-4 pb-8 sm:pt-8 px-4 sm:px-6 lg:pt-12 lg:px-8"
          >
            <dl class="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <div>
                  <dt class="text-lg leading-6 font-medium text-gray-900">
                    How do I use modules on deno.land/x?
                  </dt>
                  <dd class="mt-2">
                    <p class="text-base leading-6 text-gray-500 break-words">
                      The basic format of code URLs is
                      <InlineCode>
                        https://deno.land/x/IDENTIFIER@VERSION/FILE_PATH
                      </InlineCode>
                      . If you leave out the version it will be defaulted to the
                      most recent version released for the module.
                    </p>
                  </dd>
                </div>
                <div class="mt-12">
                  <dt class="text-lg leading-6 font-medium text-gray-900">
                    Can I find functionality built-in to Deno here?
                  </dt>
                  <dd class="mt-2">
                    <p class="text-base leading-6 text-gray-500">
                      No, the built-in runtime is documented on{" "}
<<<<<<< HEAD
                      <a className="link" href="https://doc.deno.js.cn/">
=======
                      <a class="link" href="https://doc.deno.land/">
>>>>>>> 536026728193c65673465483c3006267099de405
                        deno doc
                      </a>{" "}
                      and in the manual. See{" "}
                      <a href="/std" class="link">/std</a>{" "}
                      for the standard modules.
                    </p>
                  </dd>
                </div>
                <div class="mt-12">
                  <dt class="text-lg leading-6 font-medium text-gray-900">
                    How do I add a module to deno.land/x?
                  </dt>
                  <dd class="mt-2">
                    <p class="text-base leading-6 text-gray-500 break-words">
                      Press the button below and follow the presented
                      instructions:
                    </p>
                    <span class="block w-full rounded-md shadow-sm mt-4">
                      <a
                        href="/add_module"
                        class="w-full flex justify-center py-2 px-4 border border-gray-300 text-md font-medium rounded-md text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out"
                      >
                        Publish a module
                      </a>
                    </span>
                  </dd>
                </div>
              </div>
              <div class="mt-12 md:mt-0">
                <div>
                  <dt
                    class="text-lg leading-6 font-medium text-gray-900"
                    id="warning"
                  >
                    I am getting a warning when importing from deno.land/x!
                  </dt>
                  <dd class="mt-2">
                    <p class="text-base leading-6 text-gray-500">
                      deno.land/x warns you when you are implicitly importing
                      the latest version of a module (when you do not explicitly
                      specify a version). This is because it can{" "}
                      <a
                        href="https://github.com/denoland/dotland/issues/997"
                        class="link"
                      >
                        be unsafe to not tag dependencies
                      </a>
                      . To get rid of the warning, explicitly specify a version.
                    </p>
                  </dd>
                </div>
                <div class="mt-12">
                  <dt class="text-lg leading-6 font-medium text-gray-900">
                    Can I edit or remove a module on deno.land/x?
                  </dt>
                  <dd class="mt-2">
                    <p class="text-base leading-6 text-gray-500">
                      Module versions are persistent and immutable. It is thus
                      not possible to edit or delete a module (or version), to
                      prevent breaking programs that rely on this module.
                      Modules may be removed if there is a legal reason to do
                      (for example copyright infringement).
                    </p>
                  </dd>
                </div>
              </div>
            </dl>
          </div>
          <div class="max-w-screen-lg mx-auto pt-4 pb-8 sm:pt-8 sm:pb-12 px-4 sm:px-6 lg:pt-12 lg:pb-16 lg:px-8">
            <h4 class="font-semibold text-2xl" id="stats">
              Stats
            </h4>
            {stats
              ? (
                <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h5 class="font-medium text-lg">New modules</h5>
                    <div class="bg-white sm:shadow border border-gray-200 overflow-hidden rounded-md mt-2">
                      <ModuleList
                        modules={stats.recently_added_modules.map((v) => ({
                          name: v.name,
                          description: v.description,
                          date: v.created_at,
                          starCount: v.star_count,
                        }))}
                      />
                    </div>
                  </div>
                  <div>
                    <h5 class="font-medium text-lg">Recently updated</h5>
                    <div class="bg-white sm:shadow border border-gray-200 overflow-hidden rounded-md mt-2">
                      <ModuleList
                        modules={stats.recently_uploaded_versions.map((v) => ({
                          name: v.name,
                          description: v.version,
                          date: v.created_at,
                          starCount: undefined,
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )
              : null}
          </div>
        </div>
        <Footer simple />
      </div>
    </>
  );
}

function ModuleList({
  modules,
}: {
  modules: Array<{
    name: string;
    description: string;
    date?: string;
    starCount?: string;
  }>;
}) {
  return (
    <ul>
      {modules.map((meta, i) => {
        const link = `/x/${meta.name}`;
        return (
          <li class={i !== 0 ? "border-t border-gray-200" : ""} key={i}>
            <a
              href={link}
              class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
            >
              <div class="flex items-center px-4 sm:px-6 py-2">
                <div class="min-w-0 flex-1 flex items-center">
                  <div class="min-w-0 flex-1">
                    <div class="text-sm leading-5 font-medium text-blue-500 truncate">
                      {meta.name}
                    </div>
                    <div class="mt-1 flex items-center text-sm leading-5 text-gray-500">
                      <span class="truncate">
                        {meta.description
                          ? emojify(meta.description)
                          : (
                            <span class="italic text-gray-400">
                              No description
                            </span>
                          )}
                      </span>
                    </div>
                    {meta.date && (
                      <div class="mt-1 flex items-center text-sm leading-5 text-gray-400">
                        <span
                          class="truncate"
                          title={new Date(meta.date).toLocaleString()}
                        >
                          <time dateTime={meta.date}>
                            {twas(new Date(meta.date))}
                          </time>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {meta.starCount !== undefined && (
                  <div class="ml-6 mr-4 flex items-center">
                    <div class="text-gray-400">
                      {meta.starCount}
                    </div>
                    <svg
                      class="ml-1 text-gray-400 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <title>
                        star
                      </title>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                      </path>
                    </svg>
                  </div>
                )}
                <div>
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

//  find proper typings
// deno-lint-ignore no-explicit-any
function MaybeA({ disabled, children, ...props }: any & {
  disabled?: boolean;
  children: ComponentChildren;
}) {
  const Tag = disabled ? "div" : "a";
  return <Tag {...props}>{children}</Tag>;
}
