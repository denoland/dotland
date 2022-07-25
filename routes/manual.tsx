// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { PageProps, RouteConfig } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { Handlers } from "$fresh/server.ts";
import { Header } from "@/components/Header.tsx";
import { Markdown } from "@/components/Markdown.tsx";
import * as Icons from "@/components/Icons.tsx";
import {
  getDocURL,
  getFileURL,
  getTableOfContents,
  isPreviewVersion,
  TableOfContents,
  versions,
} from "@/util/manual_utils.ts";
import VersionSelect from "@/islands/VersionSelect.tsx";

import VERSIONS from "@/versions.json" assert { type: "json" };

interface Data {
  tableOfContents: TableOfContents;
  content: string;
  version: string;
}

export default function Manual({ params, url, data }: PageProps<Data>) {
  const { version } = data;
  const path = params.path ? `/${params.path}` : "/introduction";

  const pageList = (() => {
    const tempList: { path: string; name: string }[] = [];

    Object.entries(data.tableOfContents).forEach(([slug, entry]) => {
      tempList.push({ path: `/manual/${slug}`, name: entry.name });

      if (entry.children) {
        Object.entries(entry.children).map(([childSlug, name]) =>
          tempList.push({ path: `/manual/${slug}/${childSlug}`, name })
        );
      }
    });

    return tempList;
  })();
  const pageIndex = pageList.findIndex((page) =>
    page.path === `/manual${path}`
  );
  const sourceURL = getFileURL(version, path);

  const tableOfContentsMap = (() => {
    const map = new Map<string, string>();
    Object.entries(data.tableOfContents).forEach(([slug, entry]) => {
      if (entry.children) {
        Object.entries(entry.children).forEach(([childSlug, name]) => {
          map.set(`/${slug}/${childSlug}`, name);
        });
      }
      map.set(`/${slug}`, entry.name);
    });

    return map;
  })();
  const pageTitle = tableOfContentsMap.get(path) || "";

  const stdVersion = ((VERSIONS.cli_to_std as Record<string, string>)[
    version
  ]) ?? VERSIONS.std[0];

  const isPreview = isPreviewVersion(version);

  return (
    <>
      <Head>
        <title>
          {pageTitle === "" ? "手册 | Deno" : `${pageTitle} | 手册 | Deno`}
        </title>
        <link rel="canonical" href={`https://deno.land/manual${path}`} />
      </Head>
      <Header selected="Manual" />

<<<<<<< HEAD
        <div class={tw`md:hidden hidden`} id="manualSidebar">
          <div class={tw`fixed inset-0 flex z-40`}>
            <div class={tw`fixed inset-0`}>
              <label
                class={tw`absolute inset-0 bg-gray-600 opacity-75`}
                htmlFor="manualSidebarToggle"
              />
            </div>
            <div
              class={tw`relative flex-1 flex flex-col max-w-xs w-full bg-white`}
            >
              <div class={tw`absolute top-0 right-0 -mr-14 p-1`}>
                <label
                  class={tw`flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600`}
                  aria-label="Close sidebar"
                  htmlFor="manualSidebarToggle"
                >
                  <Icons.Cross />
                </label>
              </div>
              <div class={tw`bg-gray-100 pb-4 pt-4 border-b border-gray-200`}>
                <a
                  href="/"
                  class={tw`flex items-center flex-shrink-0 px-4`}
                >
                  <img
                    src="/logo.svg"
                    alt="logo"
                    class={tw`w-auto h-12`}
                  />
                  <div class={tw`mx-4 flex flex-col justify-center`}>
                    <div
                      class={tw`font-bold text-gray-900 leading-6 text-2xl tracking-tight`}
                    >
                      Deno 手册
                    </div>
                  </div>
                </a>
                <Version
                  version={version}
                  versions={versions}
                  path={path}
                />
              </div>
              <ToC
                tableOfContents={data.tableOfContents}
                version={params.version}
                path={path}
              />
            </div>
            <div class={tw`flex-shrink-0 w-14`}>
              {/*<!-- Dummy element to force sidebar to shrink to fit close icon -->*/}
            </div>
          </div>
        </div>
=======
      <div class={tw`flex flex-col lg:flex-row`}>
        <div>
          <input
            type="checkbox"
            id="ToCToggle"
            class={tw`hidden checked:siblings:flex checked:sibling:(border-0 children:first-child:rotate-90)`}
            autoComplete="off"
          />
>>>>>>> dc6889ced79f601a06101b6501d0a379e855029d

          <label
            htmlFor="ToCToggle"
            class={tw`lg:hidden ml-3.5 py-2 px-1.5 flex items-center gap-2 font-medium border-b border-gray-200`}
          >
<<<<<<< HEAD
            <div class={tw`bg-gray-100 pb-4 pt-4 border-b border-gray-200`}>
              <a href="/" class={tw`flex items-center flex-shrink-0 px-4`}>
                <img src="/logo.svg" alt="logo" class={tw`w-auto h-12`} />
                <div class={tw`mx-4 flex flex-col justify-center`}>
                  <div
                    class={tw`font-bold text-gray-900 leading-6 text-2xl tracking-tight`}
                  >
                    Deno 手册
                  </div>
                </div>
              </a>
              <Version
                version={version}
                versions={versions}
                path={path}
=======
            <Icons.ThinArrowRight />
            Menu
          </label>

          <div
            class={tw`hidden w-full bg-gray-50 top-0 flex-shrink-0 overflow-y-auto flex-col border-y border-gray-200 lg:(block sticky w-72 border-0 border-r h-screen)`}
          >
            <div class={tw`bg-gray-100 p-4 border-b border-gray-200`}>
              <VersionSelect
                versions={Object.fromEntries(
                  versions.map((ver) => [ver, `/manual@${ver}${path}`]),
                )}
                selectedVersion={version}
>>>>>>> dc6889ced79f601a06101b6501d0a379e855029d
              />
            </div>
            <ToC
              tableOfContents={data.tableOfContents}
              version={params.version}
              path={path}
            />
          </div>
        </div>

        <main class={tw`focus:outline-none w-full flex flex-col`} tabIndex={0}>
          {isPreview && (
            <UserContributionBanner
              href={new URL(`/manual/${params.path}`, url).href}
            />
          )}
          <div
            class={tw`section-x-inset-md pb-12 sm:pb-20 w-full justify-self-center flex-shrink-1`}
          >
            <a
              href={getDocURL(version, path)}
              class={tw`text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out float-right ${
                path.split("/").length === 2 ? "mt-11" : "mt-9"
              } mr-4`}
            >
              <span class={tw`sr-only`}>GitHub</span>
              <Icons.GitHub class="inline" />
            </a>
<<<<<<< HEAD
            <div
              class={tw`border-l border-r border-gray-200 flex-1 px-4 flex justify-between`}
            >
              <div class={tw`flex-1 flex`}>
                <div class={tw`w-full flex justify-between h-full`}>
                  <label htmlFor="search_field" class={tw`sr-only`}>
                    搜索
                  </label>
                  <button
                    class={tw`w-full text-gray-400 focus-within:text-gray-600 flex items-center`}
                    // @ts-ignore onClick does support strings
                    onClick="document.querySelector('#manualSearch button').click()"
                  >
                    <div class={tw`flex items-center pointer-events-none`}>
                      <Icons.MagnifyingGlass />
                    </div>
                    <div class={tw`pl-6`}>
                      <span class={tw`inline sm:hidden`}>搜索文章</span>
                      <span class={tw`hidden sm:inline`}>
                        搜索文章 (按 <InlineCode>/</InlineCode>{"  "}搜索)
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <label
              class={tw`focus:outline-none focus:bg-gray-100 md:hidden flex items-center`}
              htmlFor="manualSidebarToggle"
            >
              <div class={tw`px-4 text-gray-500 focus:text-gray-600`}>
                <Icons.Menu />
              </div>
            </label>
          </div>

          <main
            class={tw`flex-1 relative z-0 overflow-y-auto focus:outline-none`}
            tabIndex={0}
          >
            <div class={tw`h-16 bg-white shadow hidden md:block`}>
              <div
                class={tw`max-w-screen-md mx-auto px-12 w-full flex justify-between h-full`}
              >
                <label htmlFor="search_field" class={tw`sr-only`}>
                  搜索
                </label>
                <button
                  class={tw`w-full text-gray-400 focus-within:text-gray-600 flex items-center`}
                  // @ts-ignore onClick does support strings
                  onClick="document.querySelector('#manualSearch button').click()"
                >
                  <div class={tw`flex items-center pointer-events-none`}>
                    <Icons.MagnifyingGlass />
                  </div>
                  <div class={tw`pl-6`}>
                    搜索文章 (按 <InlineCode>/</InlineCode> 搜索)
                  </div>
                </button>
              </div>
=======

            <Markdown
              source={data.content
                .replace(/\$STD_VERSION/g, stdVersion)
                .replace(/\$CLI_VERSION/g, version)}
              baseUrl={sourceURL}
            />

            <div class={tw`mt-4 pt-4 border-t border-gray-200`}>
              {pageList[pageIndex - 1] !== undefined && (
                <a
                  href={params.version
                    ? pageList[pageIndex - 1].path.replace(
                      "manual",
                      `manual@${version}`,
                    )
                    : pageList[pageIndex - 1].path}
                  class={tw`text-gray-900 hover:text-gray-600 font-normal`}
                >
                  ← {pageList[pageIndex - 1].name}
                </a>
              )}
              {pageList[pageIndex + 1] !== undefined && (
                <a
                  href={params.version
                    ? pageList[pageIndex + 1].path.replace(
                      "manual",
                      `manual@${version}`,
                    )
                    : pageList[pageIndex + 1].path}
                  class={tw`text-gray-900 hover:text-gray-600 font-normal float-right`}
                >
                  {pageList[pageIndex + 1].name} →
                </a>
              )}
>>>>>>> dc6889ced79f601a06101b6501d0a379e855029d
            </div>
          </div>
        </main>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
        (function() {
          document.querySelectorAll(".toc-active").forEach(el=>{el.scrollIntoView({block:"center"});});
        })();
      `,
        }}
      />
    </>
  );
}

function UserContributionBanner({
  href,
}: {
  href: string;
}) {
  return (
    <div class={tw`bg-yellow-300 sticky top-0`}>
      <div class={tw`max-w-screen-xl mx-auto py-4 px-3 sm:px-6 lg:px-8`}>
        <div class={tw`flex items-center justify-between flex-wrap`}>
          <div class={tw`w-0 flex-1 flex items-center`}>
            <p class={tw`ml-3 font-medium text-gray-900`}>
              <span>
                You are viewing documentation generated from a{"  "}
                <b class={tw`font-bold`}>user contribution</b>{"  "}
                or an upcoming release. The contents of this document may not
                have been reviewed by the Deno team.{" "}
              </span>

              <a
                class={tw`underline cursor-pointer text-gray-900`}
                href={href}
              >
                Click here to view the documentation for the latest release.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToC({
  tableOfContents,
  version,
  path,
}: {
  tableOfContents: TableOfContents;
  version: string | undefined;
  path: string;
}) {
  return (
    <nav class={tw`pt-2 pb-8 px-4`}>
      <ol class={tw`list-decimal list-inside font-semibold nested`}>
        {Object.entries(tableOfContents).map(([slug, entry]) => {
          return (
            <li key={slug} class={tw`my-2`}>
              <a
                href={`/manual${version ? `@${version}` : ""}/${slug}`}
                class={tw`${
                  path === `/${slug}`
                    ? "text-blue-600 hover:text-blue-500 toc-active"
                    : "text-gray-900 hover:text-gray-600"
                } font-bold`}
              >
                {entry.name}
              </a>
              {entry.children && (
                <ol class={tw`pl-4 list-decimal nested`}>
                  {Object.entries(entry.children).map(
                    (
                      [childSlug, name],
                    ) => (
                      <li key={`${slug}/${childSlug}`} class={tw`my-0.5`}>
                        <a
                          href={`/manual${
                            version ? `@${version}` : ""
                          }/${slug}/${childSlug}`}
                          class={tw`${
                            path === `/${slug}/${childSlug}`
                              ? "text-blue-600 hover:text-blue-500 toc-active"
                              : "text-gray-900 hover:text-gray-600"
                          } font-normal`}
                        >
                          {name}
                        </a>
                      </li>
                    ),
                  )}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export const handler: Handlers<Data> = {
  async GET(req, { params, render }) {
    const url = new URL(req.url);
    if (url.pathname.endsWith(".md")) {
      url.pathname = url.pathname.slice(0, -3);
      return Response.redirect(url);
    }

    const version = params.version || versions[0];
    const sourceURL = getFileURL(
      version,
      params.path ? `/${params.path}` : "/introduction",
    );
    const [tableOfContents, content] = await Promise.all([
      getTableOfContents(version),
      fetch(sourceURL)
        .then(async (res) => {
          if (res.status !== 200) {
            await res.body?.cancel();
            throw Error(
              `Got an error (${res.status}) while getting the documentation file (${sourceURL}).`,
            );
          }
          return res.text();
        })
        .catch((e) => {
          console.error("Failed to fetch content:", e);
          return "# 404 - Not Found\nWhoops, the page does not seem to exist.";
        }),
    ]);

    return render!({ tableOfContents, content, version });
  },
};

export const config: RouteConfig = {
  routeOverride: "/manual{@:version}?/:path*",
};
