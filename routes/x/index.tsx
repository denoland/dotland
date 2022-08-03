// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { css, tw } from "@twind";
import { Handlers } from "$fresh/server.ts";
import { emojify } from "$emoji";

import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import { InlineCode } from "@/components/InlineCode.tsx";
import * as Icons from "@/components/Icons.tsx";
import { CodeBlock } from "@/components/CodeBlock.tsx";

import { listModules, ModulesList } from "@/util/registry_utils.ts";
import { Pagination } from "@/components/Pagination.tsx";

const PER_PAGE = 20;

export default function ThirdPartyRegistryList(
  { url, data }: PageProps<ModulesList | null>,
) {
  const page = parseInt(url.searchParams.get("page") || "1");
  const query = url.searchParams.get("query") || "";

  return (
    <>
      <Head>
        <title>第三方模块 | Deno</title>
      </Head>
      <div>
<<<<<<< HEAD
        <Header selected="第三方模块" />
        <div>
          <div class={tw`section-x-inset-lg mt-8`}>
            <dt class={tw`text-lg leading-6 font-medium text-gray-900`}>
              deno.js.cn/x 是什么？
            </dt>
            <dd class={tw`mt-2`}>
              <p class={tw`text-base leading-6 text-gray-500`}>
                <span class={tw`font-semibold`}>deno.js.cn/x</span>{" "}
                是 Deno 模块的托管服务。它缓存 GitHub 上的开源模块的 Release 代码，并在一个易于记忆的域名中提供它们。
=======
        <Header selected="Third Party Modules" />

        <img
          src="/images/module_banner.png"
          alt="Deno in Space"
          class={tw`hidden md:block`}
        />

        <div class={tw`section-x-inset-lg mt-16 mb-24 space-y-15`}>
          <div class={tw`flex items-start gap-14`}>
            <div class={tw`space-y-4 w-full`}>
              <h1 class={tw`font-bold text-3xl text-black`}>
                Deno Third Party Modules
              </h1>

              <p class={tw`leading-5 text-[#6C6E78]`}>
                <span class={tw`font-semibold text-default`}>deno.land/x</span>
                {" "}
                is a hosting service for Deno scripts. It caches releases of
                open-source modules stored on GitHub and serves them at an
                easy-to-remember domain.
>>>>>>> d453a811bafef36cedc0570d0bc8359d6bbc7f05
              </p>

<<<<<<< HEAD
            <div class={tw`mt-2`}>
              <a href="#info" class={tw`link`}>
                了解更多
              </a>
            </div>

            <div class={tw`mt-6`}>
              <a
                href="/add_module"
                class={tw`
                  py-2 px-8 border border-gray-300 font-medium rounded-md
                  text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50
                  focus:outline-none focus:border-blue-300
                  active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out
                  `}
              >
                发布模块
              </a>
            </div>
=======
              <CodeBlock
                code='import { start } from "https://deno.land/x/fresh@1.0.0/server.ts";'
                language="typescript"
                disablePrefixes
                url={url}
                class="lg:inline-block"
              />

              <div class={tw`space-x-2`}>
                <a
                  href="/add_module"
                  class={tw`rounded-md px-4.5 py-2.5 inline-flex items-center gap-1.5 leading-none font-medium text-white bg-tag-blue hover:bg-[#3587EF]`}
                >
                  <Icons.Plus />
                  <div>Publish a module</div>
                </a>

                <a
                  href="#Q&A"
                  class={tw`px-4.5 py-2.5 rounded-md font-medium leading-none bg-[#F3F3F3] hover:bg-dark-border`}
                >
                  Learn more
                </a>
              </div>
            </div>

>>>>>>> d453a811bafef36cedc0570d0bc8359d6bbc7f05
            {
              /*<div class={tw`px-9 py-6 rounded-xl border border-dark-border`}>
              <span class={tw`text-[#6C6E78] leading-5 whitespace-nowrap`}>
                modules registered
              </span>
            </div>*/
            }
          </div>
<<<<<<< HEAD
          <form
            method="get"
            class={tw`section-x-inset-lg mt-8`}
          >
            <label htmlFor="query" class={tw`font-medium sr-only`}>
              搜索
            </label>
            <input
              name="query"
              id="query"
              class={tw`block w-full px-4 py-2 leading-normal bg-white border border-gray-200 rounded-lg outline-none shadow hover:shadow-sm focus:shadow-sm appearance-none focus:border-gray-300 hover:border-gray-300 mt-1`}
              type="text"
              placeholder={!data.resp
                ? "搜索"
                : `在 ${data.resp.totalCount} 个模块中搜索`}
              value={query}
            />
          </form>
          <div
            class={tw`sm:max-w-screen-lg sm:mx-auto sm:px-6 md:px-8 pb-4 sm:pb-12`}
          >
            {data.resp === null
              ? (
                <div
                  class={tw`p-4 text-center sm:text-left text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  加载模块失败
                </div>
              )
              : (
                <div
                  class={tw`bg-white sm:shadow border border-gray-200 overflow-hidden sm:rounded-md mt-4`}
                >
                  {data.resp.results.length == 0
                    ? (
                      <div
                        class={tw`p-4 text-center sm:text-left text-sm leading-5 font-medium text-gray-500`}
                      >
                        没有找到模块。如果想要我们知道您正在寻找哪个模块，可以在这个
                        <a
                          class={tw`link`}
                          href="https://github.com/denoland/wanted_modules/issues"
                        >
                          新建一个 issue
                        </a>。
                      </div>
                    )
                    : (
                      <ModuleList
                        modules={data.resp.results.map((v) => ({
                          ...v,
                          starCount: v.star_count,
                        }))}
                      />
                    )}
                  {data.resp.results.length
                    ? (() => {
                      const pageCount = pageutils.pageCount({
                        totalCount: data.resp.totalCount,
                        perPage: PER_PAGE,
                      });
                      const hasPrevious = pageutils.hasPrevious({ page });
                      const hasNext = pageutils.hasNext({
                        page,
                        totalCount: data.resp.totalCount,
                        perPage: PER_PAGE,
                      });
=======
>>>>>>> d453a811bafef36cedc0570d0bc8359d6bbc7f05

          <div class={tw`border border-dark-border rounded-lg overflow-hidden`}>
            <form
              class={tw`px-5 py-4 flex items-center justify-between border-b border-dark-border bg-ultralight leading-none`}
              method="get"
            >
              <span class={tw`font-semibold`}>Explore Modules</span>
              <label
                class={tw`px-4 h-9 w-full md:w-88 bg-white rounded-md flex items-center gap-1.5 box-content border border-dark-border text-gray-400 focus-within:${
                  css({
                    "outline": "solid",
                  })
                }`}
              >
                <input
                  type="text"
                  name="query"
                  placeholder={data?.totalCount
                    ? `Search through ${data.totalCount} modules...`
                    : "Search..."}
                  class={tw`w-full bg-transparent text-default placeholder:text-gray-400 outline-none`}
                  value={query}
                />
                <Icons.MagnifyingGlass />
              </label>
            </form>

            <ul class={tw`divide-y`}>
              {data?.results.length
                ? data.results.map((result) => (
                  <li class={tw`border-dark-border`}>
                    <a
                      href={"/x/" + result.name}
                      class={tw`flex items-center justify-between px-5 py-3 gap-6 hover:bg-ultralight`}
                    >
<<<<<<< HEAD
                      The basic format of code URLs is
                      <InlineCode>
                        https://deno.land/x/IDENTIFIER@VERSION/FILE_PATH
                      </InlineCode>
                      . If you leave out the version it will be defaulted to the
                      most recent version released for the module.
                    </p>
                  </dd>
                </div>
                <div class={tw`mt-12`}>
                  <dt class={tw`text-lg leading-6 font-medium text-gray-900`}>
                    Can I find functionality built-in to Deno here?
                  </dt>
                  <dd class={tw`mt-2`}>
                    <p class={tw`text-base leading-6 text-gray-500`}>
                      No, the built-in runtime is documented on{" "}
                      <a class={tw`link`} href="https://doc.deno.js.cn/">
                        deno doc
                      </a>{" "}
                      and in the manual. See{" "}
                      <a href="/std" class={tw`link`}>/std</a>{" "}
                      for the standard modules.
                    </p>
                  </dd>
                </div>
                <div class={tw`mt-12`}>
                  <dt class={tw`text-lg leading-6 font-medium text-gray-900`}>
                    How do I add a module to deno.land/x?
                  </dt>
                  <dd class={tw`mt-2`}>
                    <p
                      class={tw`text-base leading-6 text-gray-500 break-words`}
                    >
                      Press the button below and follow the presented
                      instructions:
                    </p>
                    <span class={tw`block w-full rounded-md shadow-sm mt-4`}>
                      <a
                        href="/add_module"
                        class={tw`w-full flex justify-center py-2 px-4 border border-gray-300 font-medium rounded-md text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out`}
                      >
                        Publish a module
                      </a>
                    </span>
                  </dd>
                </div>
              </div>
              <div class={tw`mt-12 md:mt-0`}>
                <div>
                  <dt
                    class={tw`text-lg leading-6 font-medium text-gray-900`}
                    id="warning"
=======
                      <div>
                        <div class={tw`text-tag-blue font-semibold`}>
                          {result.name}
                        </div>
                        <div class={tw`text-gray-400`}>
                          {result.description
                            ? emojify(result.description)
                            : (
                              <span class={tw`italic font-semibold`}>
                                No description
                              </span>
                            )}
                        </div>
                      </div>

                      <div class={tw`flex items-center gap-4`}>
                        {result.star_count !== undefined && (
                          <div class={tw`flex items-center text-gray-400`}>
                            <div>
                              {result.star_count}
                            </div>
                            <Icons.Star class="ml-1" title="star" />
                          </div>
                        )}

                        <Icons.ArrowRight class="text-gray-400" />
                      </div>
                    </a>
                  </li>
                ))
                : (
                  <div
                    class={tw`p-4 text-center sm:text-left text-sm leading-5 font-medium text-gray-500`}
>>>>>>> d453a811bafef36cedc0570d0bc8359d6bbc7f05
                  >
                    No modules found. Please let us know what you're looking for
                    by{" "}
                    <a
                      class={tw`link`}
                      href="https://github.com/denoland/wanted_modules/issues"
                    >
                      opening an issue here
                    </a>.
                  </div>
                )}
            </ul>

            <div
              class={tw`px-5 py-4 border-t border-dark-border bg-ultralight flex items-center justify-between`}
            >
              {!!data?.results.length && (
                <Pagination
                  {...{
                    currentPage: page,
                    perPage: PER_PAGE,
                    data,
                    query,
                  }}
                />
              )}
            </div>
          </div>

          <div id="Q&A" class={tw`space-y-6`}>
            <h1 class={tw`font-bold text-3xl text-black`}>Q&A</h1>

            <div class={tw`space-y-3`}>
              <h2 class={tw`text-xl leading-6 font-semibold`}>
                How do I use modules on deno.land/x?
              </h2>
              <p class={tw`text-[#6C6E78] leading-5`}>
                The basic format of code URLs is{" "}
                <InlineCode>
                  https://deno.land/x/IDENTIFIER@VERSION/FILE_PATH
                </InlineCode>
                . If you leave out the version it will be defaulted to the most
                recent version released for the module.
              </p>
            </div>

            <div class={tw`space-y-3`}>
              <h2 class={tw`text-xl leading-6 font-semibold`}>
                Can I find functionality built-in to Deno here?
              </h2>
              <p class={tw`text-[#6C6E78] leading-5`}>
                No, the built-in runtime is documented on{" "}
                <a class={tw`link`} href="https://doc.deno.land/">
                  deno doc
                </a>{" "}
                and in the manual. See <a href="/std" class={tw`link`}>/std</a>
                {" "}
                for the standard modules.
              </p>
            </div>

            <div class={tw`space-y-3`}>
              <h2 class={tw`text-xl leading-6 font-semibold`}>
                I am getting a warning when importing from deno.land/x!
              </h2>
              <p class={tw`text-[#6C6E78] leading-5`}>
                deno.land/x warns you when you are implicitly importing the
                latest version of a module (when you do not explicitly specify a
                version). This is because it can{" "}
                <a
                  href="https://github.com/denoland/dotland/issues/997"
                  class={tw`link`}
                >
                  be unsafe to not tag dependencies
                </a>
                . To get rid of the warning, explicitly specify a version.
              </p>
            </div>

            <div class={tw`space-y-3`}>
              <h2 class={tw`text-xl leading-6 font-semibold`}>
                Can I edit or remove a module on deno.land/x?
              </h2>
              <p class={tw`text-[#6C6E78] leading-5`}>
                Module versions are persistent and immutable. It is thus not
                possible to edit or delete a module (or version), to prevent
                breaking programs that rely on this module. Modules may be
                removed if there is a legal reason to do (for example copyright
                infringement).
              </p>
            </div>

            <div class={tw`space-y-3`}>
              <h2 class={tw`text-xl leading-6 font-semibold`}>
                I can't find a specific module. Help!
              </h2>
              <a
                href="https://github.com/denoland/wanted_modules/issues"
                class={tw`rounded-md leading-none font-medium bg-tag-blue px-4.5 py-2.5 inline-flex items-center text-white gap-1.5 hover:bg-[#3587EF]`}
              >
                <div>Open an issue here</div>
                <Icons.ArrowRight />
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export const handler: Handlers<ModulesList | null> = {
  async GET(req, { render }) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const query = url.searchParams.get("query") || "";

    const resp = await listModules(page, PER_PAGE, query);

    return render!(resp);
  },
};
