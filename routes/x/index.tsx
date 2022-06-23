// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { Handlers } from "$fresh/server.ts";
import twas from "$twas";
import { emojify } from "$emoji";

import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import { InlineCode } from "@/components/InlineCode.tsx";
import * as Icons from "@/components/Icons.tsx";

import {
  getStats,
  listModules,
  ModulesList,
  Stats,
} from "@/util/registry_utils.ts";
import * as pageutils from "@/util/pagination_utils.ts";
import { Pagination } from "@/components/Pagination.tsx";

const PER_PAGE = 20;

interface Data {
  resp: ModulesList | null;
  stats: Stats | null;
}

export default function ThirdPartyRegistryList({ url, data }: PageProps<Data>) {
  const page = parseInt(url.searchParams.get("page") || "1");
  const query = url.searchParams.get("query") || "";

  return (
    <>
      <Head>
        <title>第三方模块 | Deno</title>
      </Head>
      <div class={tw`bg-gray`}>
        <Header subtitle="第三方模块" widerContent={true} />
        <div>
          <div class={tw`max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 mt-8`}>
            <dt class={tw`text-lg leading-6 font-medium text-gray-900`}>
              deno.js.cn/x 是什么？
            </dt>
            <dd class={tw`mt-2`}>
              <p class={tw`text-base leading-6 text-gray-500`}>
                <span class={tw`font-semibold`}>deno.js.cn/x</span>{" "}
                是 Deno 模块的托管服务。它缓存 GitHub 上的开源模块的 Release 代码，并在一个易于记忆的域名中提供它们。
              </p>
            </dd>

            <div class={tw`mt-2`}>
              <a href="#info" class={tw`link`}>
                了解更多
              </a>
            </div>

            <div class={tw`mt-6`}>
              <a
                href="/add_module"
                class={tw`
                  py-2 px-8 border border-gray-300 text-md font-medium rounded-md
                  text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50
                  focus:outline-none focus:shadow-outline-blue focus:border-blue-300
                  active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out
                  `}
              >
                发布模块
              </a>
            </div>
            {
              /* <div class={tw`mt-8`}>
              <ErrorMessage title="Ongoing incident">
                We are currently seeing delays and timeouts during module publishing and search. Serving of already published modules and `std` is not affected. We are working on resolving the problem.
              <ErrorMessage />
            </div> */
            }
          </div>
          <form
            method="get"
            class={tw`max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 mt-8`}
          >
            <label htmlFor="query" class={tw`font-medium sr-only`}>
              搜索
            </label>
            <input
              name="query"
              id="query"
              class={tw
                `block w-full px-4 py-2 leading-normal bg-white border border-gray-200 rounded-lg outline-none shadow hover:shadow-sm focus:shadow-sm appearance-none focus:border-gray-300 hover:border-gray-300 mt-1`}
              type="text"
              placeholder={!data.resp
                ? "搜索"
                : `在 ${data.resp.totalCount} 个模块中搜索`}
              value={query}
            />
          </form>
          <div
            class={tw
              `sm:max-w-screen-lg sm:mx-auto sm:px-6 md:px-8 pb-4 sm:pb-12`}
          >
            {data.resp === null
              ? (
                <div
                  class={tw
                    `p-4 text-center sm:text-left text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  加载模块失败
                </div>
              )
              : (
                <div
                  class={tw
                    `bg-white sm:shadow border border-gray-200 overflow-hidden sm:rounded-md mt-4`}
                >
                  {data.resp.results.length == 0
                    ? (
                      <div
                        class={tw
                          `p-4 text-center sm:text-left text-sm leading-5 font-medium text-gray-500`}
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

                      return (
                        <Pagination
                          {...{
                            currentPage: page,
                            hasNext,
                            hasPrevious,
                            pageCount,
                            perPage: PER_PAGE,
                            response: data.resp,
                            query,
                          }}
                        />
                      );
                    })()
                    : null}
                </div>
              )}
          </div>
          <div
            id="info"
            class={tw
              `max-w-screen-xl mx-auto pt-4 pb-8 sm:pt-8 px-4 sm:px-6 lg:pt-12 lg:px-8`}
          >
            <dl class={tw`md:grid md:grid-cols-2 md:gap-8`}>
              <div>
                <div>
                  <dt class={tw`text-lg leading-6 font-medium text-gray-900`}>
                    How do I use modules on deno.land/x?
                  </dt>
                  <dd class={tw`mt-2`}>
                    <p
                      class={tw`text-base leading-6 text-gray-500 break-words`}
                    >
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
                        class={tw
                          `w-full flex justify-center py-2 px-4 border border-gray-300 text-md font-medium rounded-md text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out`}
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
                  >
                    I am getting a warning when importing from deno.land/x!
                  </dt>
                  <dd class={tw`mt-2`}>
                    <p class={tw`text-base leading-6 text-gray-500`}>
                      deno.land/x warns you when you are implicitly importing
                      the latest version of a module (when you do not explicitly
                      specify a version). This is because it can{" "}
                      <a
                        href="https://github.com/denoland/dotland/issues/997"
                        class={tw`link`}
                      >
                        be unsafe to not tag dependencies
                      </a>
                      . To get rid of the warning, explicitly specify a version.
                    </p>
                  </dd>
                </div>
                <div class={tw`mt-12`}>
                  <dt class={tw`text-lg leading-6 font-medium text-gray-900`}>
                    Can I edit or remove a module on deno.land/x?
                  </dt>
                  <dd class={tw`mt-2`}>
                    <p class={tw`text-base leading-6 text-gray-500`}>
                      Module versions are persistent and immutable. It is thus
                      not possible to edit or delete a module (or version), to
                      prevent breaking programs that rely on this module.
                      Modules may be removed if there is a legal reason to do
                      (for example copyright infringement).
                    </p>
                  </dd>
                </div>
                <div class={tw`mt-12`}>
                  <dt class={tw`text-lg leading-6 font-medium text-gray-900`}>
                    I can't find a specific module. Help!
                  </dt>
                  <dd class={tw`mt-2`}>
                    <p class={tw`text-base leading-6 text-gray-500`}>
                      Please let us know which one by{" "}
                      <a
                        class={tw`link`}
                        href="https://github.com/denoland/wanted_modules/issues"
                      >
                        opening an issue here
                      </a>.
                    </p>
                  </dd>
                </div>
              </div>
            </dl>
          </div>
          <div
            class={tw
              `max-w-screen-lg mx-auto pt-4 pb-8 sm:pt-8 sm:pb-12 px-4 sm:px-6 lg:pt-12 lg:pb-16 lg:px-8`}
          >
            <h4 class={tw`font-semibold text-2xl`} id="stats">
              Stats
            </h4>
            {data.stats
              ? (
                <div class={tw`mt-4 grid grid-cols-1 sm:grid-cols-2 gap-8`}>
                  <div>
                    <h5 class={tw`font-medium text-lg`}>New modules</h5>
                    <div
                      class={tw
                        `bg-white sm:shadow border border-gray-200 overflow-hidden rounded-md mt-2`}
                    >
                      <ModuleList
                        modules={data.stats.recently_added_modules.map((v) => ({
                          name: v.name,
                          description: v.description,
                          date: v.created_at,
                          starCount: v.star_count,
                        }))}
                      />
                    </div>
                  </div>
                  <div>
                    <h5 class={tw`font-medium text-lg`}>Recently updated</h5>
                    <div
                      class={tw
                        `bg-white sm:shadow border border-gray-200 overflow-hidden rounded-md mt-2`}
                    >
                      <ModuleList
                        modules={data.stats.recently_uploaded_versions.map((
                          v,
                        ) => ({
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
              class={tw
                `block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out`}
            >
              <div class={tw`flex items-center px-4 sm:px-6 py-2`}>
                <div class={tw`min-w-0 flex-1 flex items-center`}>
                  <div class={tw`min-w-0 flex-1`}>
                    <div
                      class={tw
                        `text-sm leading-5 font-medium text-blue-500 truncate`}
                    >
                      {meta.name}
                    </div>
                    <div
                      class={tw
                        `mt-1 flex items-center text-sm leading-5 text-gray-500`}
                    >
                      <span class={tw`truncate`}>
                        {meta.description
                          ? emojify(meta.description)
                          : (
                            <span class={tw`italic text-gray-400`}>
                              No description
                            </span>
                          )}
                      </span>
                    </div>
                    {meta.date && (
                      <div
                        class={tw
                          `mt-1 flex items-center text-sm leading-5 text-gray-400`}
                      >
                        <span
                          class={tw`truncate`}
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
                  <div class={tw`ml-6 mr-4 flex items-center`}>
                    <div class={tw`text-gray-400`}>
                      {meta.starCount}
                    </div>
                    <Icons.Star class="ml-1 text-gray-400" title="star" />
                  </div>
                )}
                <div>
                  <Icons.ArrowRight />
                </div>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export const handler: Handlers<Data> = {
  async GET(req, { params, render }) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const query = url.searchParams.get("query") || "";

    const [resp, stats] = await Promise.all([
      listModules(page, PER_PAGE, query),
      getStats(),
    ]);

    return render!({ resp, stats });
  },
};
