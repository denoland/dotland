// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import {
  ComponentChildren,
  Fragment,
  h,
  Head,
  PageConfig,
  PageProps,
  useData,
} from "../deps.ts";
import { Handlers } from "../server_deps.ts";
import { Markdown } from "../components/Markdown.tsx";
import { InlineCode } from "../components/InlineCode.tsx";
import {
  basepath,
  getDocURL,
  getFileURL,
  getTableOfContents,
  isPreviewVersion,
  TableOfContents,
  versions,
} from "../util/manual_utils.ts";

import versionMeta from "../versions.json" assert { type: "json" };

export default function Manual({ params, url }: PageProps) {
  const path = params.path ? `/${params.path}` : "/introduction";

  const tableOfContents = useData(params.version, getTableOfContents);
  const pageList = (() => {
    const tempList: { path: string; name: string }[] = [];

    Object.entries(tableOfContents).forEach(([slug, entry]) => {
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
  const sourceURL = getFileURL(params.version, path);

  const tableOfContentsMap = (() => {
    const map = new Map<string, string>();
    Object.entries(tableOfContents).forEach(([slug, entry]) => {
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

  const content = useData(sourceURL, () => {
    return fetch(sourceURL)
      .then((res) => {
        if (res.status !== 200) {
          throw Error(
            `Got an error (${res.status}) while getting the documentation file (${sourceURL}).`,
          );
        }
        return res.text();
      })
      .catch((e) => {
        console.error("Failed to fetch content:", e);
        return "# 404 - Not Found\nWhoops, the page does not seem to exist.";
      });
  });

  const stdVersion = ((versionMeta.cli_to_std as Record<string, string>)[
    params.version
  ]) ?? versionMeta.std[0];

  const isPreview = isPreviewVersion(params.version);

  return (
    <div>
      <Head>
        <title>
          {pageTitle === "" ? "Manual | Deno" : `${pageTitle} | Manual | Deno`}
        </title>
        <link
          rel="preconnect"
          href="https://BH4D9OD16A-dsn.algolia.net"
          crossOrigin="true"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@docsearch/css@3"
        />
        <link rel="canonical" href={`https://deno.land/manual${path}`} />
      </Head>
      <script src="https://cdn.jsdelivr.net/npm/@docsearch/js@3" />
      <div id="manualSearch" class="hidden" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
        docsearch({
          container: "#manualSearch",
          appId: "DMFING7U5D",
          indexName: "deno_manual",
          apiKey: "577997f9f7a4b0100d359afde8065583",
          searchParameters: {
            distinct: 1,
          },
        });
      `,
        }}
      />
      <div class="h-screen flex overflow-hidden">
        <input
          type="checkbox"
          class="hidden"
          id="manualSidebarToggle"
          autoComplete="off"
        />

        <div class="md:hidden hidden" id="manualSidebar">
          <div class="fixed inset-0 flex z-40">
            <div class="fixed inset-0">
              <label
                class="absolute inset-0 bg-gray-600 opacity-75"
                htmlFor="manualSidebarToggle"
              />
            </div>
            <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div class="absolute top-0 right-0 -mr-14 p-1">
                <label
                  class="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600"
                  aria-label="Close sidebar"
                  htmlFor="manualSidebarToggle"
                >
                  <svg
                    class="h-6 w-6 text-white"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </label>
              </div>
              <div class="bg-gray-100 pb-4 pt-4 border-b border-gray-200">
                <a
                  href="/"
                  class="flex items-center flex-shrink-0 px-4"
                >
                  <img
                    src="/logo.svg"
                    alt="logo"
                    class="w-auto h-12"
                  />
                  <div class="mx-4 flex flex-col justify-center">
                    <div class="font-bold text-gray-900 leading-6 text-2xl tracking-tight">
                      Deno Manual
                    </div>
                  </div>
                </a>
                <Version
                  version={params.version}
                  versions={versions}
                  path={path}
                />
              </div>
              <ToC
                tableOfContents={tableOfContents}
                version={params.version}
                path={path}
              />
            </div>
            <div class="flex-shrink-0 w-14">
              {/*<!-- Dummy element to force sidebar to shrink to fit close icon -->*/}
            </div>
          </div>
        </div>

        <div class="hidden md:flex md:flex-shrink-0">
          <div class="flex flex-col w-72 border-r border-gray-200 bg-gray-50">
            <div class="bg-gray-100 pb-4 pt-4 border-b border-gray-200">
              <a href="/" class="flex items-center flex-shrink-0 px-4">
                <img src="/logo.svg" alt="logo" class="w-auto h-12" />
                <div class="mx-4 flex flex-col justify-center">
                  <div class="font-bold text-gray-900 leading-6 text-2xl tracking-tight">
                    Deno Manual
                  </div>
                </div>
              </a>
              <Version
                version={params.version}
                versions={versions}
                path={path}
              />
            </div>
            <ToC
              tableOfContents={tableOfContents}
              version={params.version}
              path={path}
            />
          </div>
        </div>
        <div class="flex flex-col w-0 flex-1 overflow-hidden">
          <div class="z-10 flex-shrink-0 flex h-16 bg-white shadow md:hidden">
            <a
              href="/"
              class="px-4 flex items-center justify-center md:hidden"
            >
              <img src="/logo.svg" alt="logo" class="w-auto h-10" />
            </a>
            <div class="border-l border-r border-gray-200 flex-1 px-4 flex justify-between">
              <div class="flex-1 flex">
                <div class="w-full flex justify-between h-full">
                  <label htmlFor="search_field" class="sr-only">
                    Search
                  </label>
                  <button
                    class="w-full text-gray-400 focus-within:text-gray-600 flex items-center"
                    onClick="document.querySelector('#manualSearch button').click()"
                  >
                    <div class="flex items-center pointer-events-none">
                      <svg
                        class="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        />
                      </svg>
                    </div>
                    <div class="pl-6">
                      <span class="inline sm:hidden">Search docs</span>
                      <span class="hidden sm:inline">
                        Search the docs (press <InlineCode>/</InlineCode>{" "}
                        to focus)
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <label
              class="focus:outline-none focus:bg-gray-100 md:hidden flex items-center"
              htmlFor="manualSidebarToggle"
            >
              <div class="px-4 text-gray-500 focus:text-gray-600">
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
            </label>
          </div>

          <main
            class="flex-1 relative z-0 overflow-y-auto focus:outline-none"
            tabIndex={0}
          >
            <div class="h-16 bg-white shadow hidden md:block">
              <div class="max-w-screen-md mx-auto px-12 w-full flex justify-between h-full">
                <label htmlFor="search_field" class="sr-only">
                  Search
                </label>
                <button
                  class="w-full text-gray-400 focus-within:text-gray-600 flex items-center"
                  onClick="document.querySelector('#manualSearch button').click()"
                >
                  <div class="flex items-center pointer-events-none">
                    <svg
                      class="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      />
                    </svg>
                  </div>
                  <div class="pl-6">
                    Search the docs (press <InlineCode>/</InlineCode> to focus)
                  </div>
                </button>
              </div>
            </div>

            {isPreview && (
              <UserContributionBanner
                href={(() => {
                  const newUrl = new URL(
                    `/manual@${versions[0]}/${params.path}`,
                    url,
                  );
                  return newUrl.href;
                })()}
              />
            )}
            <div class="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 pb-12 sm:pb-20">
              <a
                href={getDocURL(params.version, path)}
                class={`text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out float-right ${
                  path.split("/").length === 2 ? "mt-11" : "mt-9"
                } mr-4`}
              >
                <span class="sr-only">GitHub</span>
                <svg
                  class="h-6 w-6 inline"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Edit on GitHub</title>
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <div class="pt-1">
                <Markdown
                  source={content
                    .replace(/\$STD_VERSION/g, stdVersion)
                    .replace(/\$CLI_VERSION/g, params.version)}
                  baseUrl={sourceURL}
                />
              </div>
              <div class="mt-4 pt-4 border-t border-gray-200">
                {pageList[pageIndex - 1] !== undefined && (
                  <a
                    href={params.version
                      ? pageList[pageIndex - 1].path.replace(
                        "manual",
                        `manual@${params.version}`,
                      )
                      : pageList[pageIndex - 1].path}
                    class="text-gray-900 hover:text-gray-600 font-normal"
                  >
                    ← {pageList[pageIndex - 1].name}
                  </a>
                )}
                {pageList[pageIndex + 1] !== undefined && (
                  <a
                    href={params.version
                      ? pageList[pageIndex + 1].path.replace(
                        "manual",
                        `manual@${params.version}`,
                      )
                      : pageList[pageIndex + 1].path}
                    class="text-gray-900 hover:text-gray-600 font-normal float-right"
                  >
                    {pageList[pageIndex + 1].name} →
                  </a>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function UserContributionBanner({
  href,
}: {
  href: string;
}) {
  return (
    <div class="bg-yellow-300 sticky top-0">
      <div class="max-w-screen-xl mx-auto py-4 px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between flex-wrap">
          <div class="w-0 flex-1 flex items-center">
            <p class="mr-3 font-medium text-gray-900">
              <span>
                You are viewing documentation generated from a{"  "}
                <b class="font-bold">user contribution</b>{"  "}
                or an upcoming or past release. The contents of this document
                may not have been reviewed by the Deno team.{" "}
              </span>

              <a
                class="underline cursor-pointer text-gray-900"
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

function Version({
  version,
  versions,
  path,
}: {
  version: string;
  versions: string[];
  path: string;
}) {
  return (
    <div class="mt-5 px-4">
      <label htmlFor="version" class="sr-only">
        Version
      </label>
      <div class="mt-1 sm:mt-0 sm:col-span-2">
        <div class="max-w-xs rounded-md shadow-sm">
          <select
            id="version"
            class="block form-select w-full transition duration-150 ease-in-out sm:text-sm! sm:leading-5!"
            autoComplete="off"
            value={version}
            onChange={`((e) => { window.location = "/manual@" + e.target.value + "${path}"; })(event)`}
          >
            {version !== "main" && !versions.includes(version) &&
              (
                <option key={version} value={version}>
                  {version}
                </option>
              )}
            <option key="main" value="main">
              main
            </option>
            {versions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
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
    <div class="pt-2 pb-8 h-0 flex-1 flex flex-col overflow-y-auto">
      <nav class="flex-1 px-4">
        <ol class="list-decimal list-inside font-semibold nested">
          {Object.entries(tableOfContents).map(([slug, entry]) => {
            return (
              <li key={slug} class="my-2">
                <a
                  href={`/manual${version ? `@${version}` : ""}/${slug}`}
                  class={`${
                    path === `/${slug}`
                      ? "text-blue-600 hover:text-blue-500 toc-active"
                      : "text-gray-900 hover:text-gray-600"
                  } font-bold`}
                >
                  {entry.name}
                </a>
                {entry.children && (
                  <ol class="pl-4 list-decimal nested">
                    {Object.entries(entry.children).map(
                      (
                        [childSlug, name],
                      ) => (
                        <li key={`${slug}/${childSlug}`} class="my-0.5">
                          <a
                            href={`/manual${
                              version ? `@${version}` : ""
                            }/${slug}/${childSlug}`}
                            class={`${
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
    </div>
  );
}

export const handler: Handlers = {
  GET({ req, match, render }) {
    const url = new URL(req.url);
    if (!match.version) {
      url.pathname = `/manual@${versions[0]}/${match.path ?? ""}`;
      return Response.redirect(url);
    }
    if (url.pathname.endsWith(".md")) {
      url.pathname = url.pathname.slice(0, -3);
      return Response.redirect(url);
    }
    return render!();
  },
};

export const config: PageConfig = {
  routeOverride: "/manual{@:version}?/:path*",
};
