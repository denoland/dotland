// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { PageProps, RouteConfig } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { Handlers } from "$fresh/server.ts";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
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

      <div
        class={tw`flex flex-col items-start gap-12 lg:flex-row section-x-inset-xl mt-12 mb-16`}
      >
        <div>
          <input
            type="checkbox"
            id="ToCToggle"
            class={tw`hidden checked:siblings:flex checked:sibling:(border-0 children:first-child:rotate-90)`}
            autoComplete="off"
          />

          <label
            htmlFor="ToCToggle"
            class={tw`lg:hidden ml-3.5 py-2 px-1.5 flex items-center gap-2 font-medium border-b border-gray-200`}
          >
            <Icons.ThinArrowRight />
            Menu
          </label>

          <div
            class={tw`hidden w-full flex-shrink-0 overflow-y-auto flex-col gap-4 lg:(flex w-72 h-min)`}
          >
            <VersionSelect
              versions={Object.fromEntries(
                versions.map((ver) => [ver, `/manual@${ver}${path}`]),
              )}
              selectedVersion={version}
            />
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
            class={tw`w-full justify-self-center flex-shrink-1`}
          >
            <a
              href={getDocURL(version, path)}
              class={tw`float-right py-2.5 px-4.5 rounded-md bg-[#F3F3F3] leading-none font-medium`}
            >
              Edit
            </a>

            <Markdown
              source={data.content
                .replace(/\$STD_VERSION/g, stdVersion)
                .replace(/\$CLI_VERSION/g, version)}
              baseUrl={sourceURL}
            />

            <div class={tw`mt-14`}>
              {pageList[pageIndex - 1] && (
                <a
                  href={params.version
                    ? pageList[pageIndex - 1].path.replace(
                      "manual",
                      `manual@${version}`,
                    )
                    : pageList[pageIndex - 1].path}
                  class={tw`font-normal inline-flex items-center px-4 py-3 rounded-lg border border-dark-border gap-4`}
                >
                  <Icons.ThinArrowRight class={tw`rotate-180`} />
                  <div>
                    <span class={tw`block text-sm leading-none text-[#9CA0AA]`}>
                      Prev
                    </span>
                    <span class={tw`block font-medium`}>
                      {pageList[pageIndex - 1].name}
                    </span>
                  </div>
                </a>
              )}
              {pageList[pageIndex + 1] && (
                <a
                  href={params.version
                    ? pageList[pageIndex + 1].path.replace(
                      "manual",
                      `manual@${version}`,
                    )
                    : pageList[pageIndex + 1].path}
                  class={tw`font-normal inline-flex items-center px-4 py-3 rounded-lg border border-dark-border gap-4 float-right text-right`}
                >
                  <div>
                    <span class={tw`block text-sm leading-none text-[#9CA0AA]`}>
                      Prev
                    </span>
                    <span class={tw`block font-medium`}>
                      {pageList[pageIndex + 1].name}
                    </span>
                  </div>
                  <Icons.ThinArrowRight />
                </a>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />

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
    <nav>
      <ol class={tw`list-decimal list-inside font-semibold nested`}>
        {Object.entries(tableOfContents).map(([slug, entry]) => {
          return (
            <li
              key={slug}
              class={tw`pl-3 py-2 rounded-md ${
                path === `/${slug}`
                  ? "text-tag-blue hover:text-blue-500 bg-ultralight"
                  : "hover:text-gray-600"
              }`}
            >
              <a
                href={`/manual${version ? `@${version}` : ""}/${slug}`}
                class={tw`${path === `/${slug}` ? "toc-active" : ""} font-bold`}
              >
                {entry.name}
              </a>
              {entry.children && (
                <ol class={tw`list-decimal font-normal nested`}>
                  {Object.entries(entry.children).map(
                    (
                      [childSlug, name],
                    ) => (
                      <li
                        key={`${slug}/${childSlug}`}
                        class={tw`pl-8 py-1 rounded-md ${
                          path === `/${slug}/${childSlug}`
                            ? "text-tag-blue hover:text-blue-500 bg-ultralight"
                            : "hover:text-gray-600"
                        }`}
                      >
                        <a
                          href={`/manual${
                            version ? `@${version}` : ""
                          }/${slug}/${childSlug}`}
                          class={tw`${
                            path === `/${slug}/${childSlug}` ? "toc-active" : ""
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
