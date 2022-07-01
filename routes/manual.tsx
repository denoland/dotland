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
          {pageTitle === "" ? "Manual | Deno" : `${pageTitle} | Manual | Deno`}
        </title>
        <link rel="canonical" href={`https://deno.land/manual${path}`} />
      </Head>
      <Header selected="Manual" />

      <div class={tw`flex`}>
        <div
          class={tw
            `w-72 border-r border-gray-200 bg-gray-50 h-screen sticky top-0 flex-shrink-0 overflow-y-auto`}
        >
          <div class={tw`bg-gray-100 p-4 border-b border-gray-200`}>
            <VersionSelect
              versions={Object.fromEntries(
                versions.map((ver) => [ver, `/manual@${ver}${path}`]),
              )}
              selectedVersion={version}
            />
          </div>
          <ToC
            tableOfContents={data.tableOfContents}
            version={params.version}
            path={path}
          />
        </div>

        <main class={tw`focus:outline-none w-full flex flex-col`} tabIndex={0}>
          {isPreview && (
            <UserContributionBanner
              href={new URL(`/manual/${params.path}`, url).href}
            />
          )}
          <div
            class={tw`section-x-inset-md pb-12 sm:pb-20 justify-self-center`}
          >
            <a
              href={getDocURL(version, path)}
              class={tw
                `text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out float-right ${
                  path.split("/").length === 2 ? "mt-11" : "mt-9"
                } mr-4`}
            >
              <span class={tw`sr-only`}>GitHub</span>
              <Icons.GitHub class="inline" />
            </a>

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
                  class={tw
                    `text-gray-900 hover:text-gray-600 font-normal float-right`}
                >
                  {pageList[pageIndex + 1].name} →
                </a>
              )}
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
