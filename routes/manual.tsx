// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { PageProps, RouteConfig } from "$fresh/server.ts";
import { tw } from "@twind";
import { Handlers } from "$fresh/server.ts";
import { ContentMeta } from "@/components/ContentMeta.tsx";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Markdown } from "@/components/Markdown.tsx";
import * as Icons from "@/components/Icons.tsx";
import { ManualOrAPI, SidePanelPage } from "@/components/SidePanelPage.tsx";
import {
  getDescription,
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
  const path = `/${params.path}`;

  const pageList = (() => {
    const tempList: { path: string; name: string }[] = [];

    function tocGen(toc: TableOfContents, parentSlug: string) {
      for (const [childSlug, entry] of Object.entries(toc)) {
        const slug = `${parentSlug}/${childSlug}`;
        const name = typeof entry === "string" ? entry : entry.name;
        tempList.push({ path: slug, name });
        if (typeof entry === "object" && entry.children) {
          tocGen(entry.children, slug);
        }
      }
    }
    tocGen(data.tableOfContents, "/manual");

    return tempList;
  })();
  const pageIndex = pageList.findIndex((page) =>
    page.path === `/manual${path}`
  );
  const sourceURL = getFileURL(version, path);

  const tableOfContentsMap = (() => {
    const map = new Map<string, string>();

    function tocGen(toc: TableOfContents, parentSlug: string) {
      for (const [childSlug, entry] of Object.entries(toc)) {
        const slug = `${parentSlug}/${childSlug}`;
        const name = typeof entry === "string" ? entry : entry.name;
        map.set(slug, name);
        if (typeof entry === "object" && entry.children) {
          tocGen(entry.children, slug);
        }
      }
    }
    tocGen(data.tableOfContents, "");

    return map;
  })();
  const pageTitle = tableOfContentsMap.get(path) || "";

  const stdVersion = ((VERSIONS.cli_to_std as Record<string, string>)[
    version
  ]) ?? VERSIONS.std[0];

  const isPreview = isPreviewVersion(version);

  return (
    <>
      <ContentMeta
        title={pageTitle ? `${pageTitle} | Manual` : "Manual"}
        description={getDescription(data.content)}
        creator="@deno_land"
        ogType="article"
        keywords={[
          "deno",
          "manual",
          "documentation",
          "javascript",
          "typescript",
        ]}
      />
      <Header selected="Manual" manual />

      <SidePanelPage
        sidepanel={
          <>
            <ManualOrAPI current="Manual" version={version} />
            <div class={tw`space-y-3 children:w-full`}>
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
          </>
        }
      >
        {isPreview && (
          <UserContributionBanner
            href={new URL(`/manual/${params.path}`, url).href}
          />
        )}
        <div class={tw`w-full justify-self-center flex-shrink-1`}>
          <a
            href={getDocURL(version, path)}
            class={tw`float-right py-2.5 px-4.5 rounded-md bg-[#F3F3F3] hover:bg-border leading-none font-medium`}
          >
            Edit
          </a>

          <Markdown
            source={data.content
              .replace(/(\[.+\]\((?!https?:).+)\.md(\))/g, "$1$2")
              .replaceAll("$STD_VERSION", stdVersion)
              .replaceAll("$CLI_VERSION", version)}
            baseURL={sourceURL}
          />

          <div class={tw`mt-14`}>
            {pageList[pageIndex - 1] && (
              <a
                href={pageList[pageIndex - 1].path.replace(
                  "manual",
                  `manual@${version}`,
                )}
                class={tw`font-medium inline-flex items-center px-4.5 py-2.5 rounded-lg border border-border gap-1.5 hover:bg-light-border`}
              >
                <Icons.ChevronLeft />
                <div>
                  {pageList[pageIndex - 1].name}
                </div>
              </a>
            )}
            {pageList[pageIndex + 1] && (
              <a
                href={pageList[pageIndex + 1].path.replace(
                  "manual",
                  `manual@${version}`,
                )}
                class={tw`font-medium inline-flex items-center px-4.5 py-2.5 rounded-lg border border-border gap-1.5 float-right text-right hover:bg-light-border`}
              >
                <div>
                  {pageList[pageIndex + 1].name}
                </div>
                <Icons.ChevronRight />
              </a>
            )}
          </div>
        </div>
      </SidePanelPage>
      <Footer />
    </>
  );
}

function UserContributionBanner({
  href,
}: {
  href: string;
}) {
  return (
    <div
      class={tw`bg-yellow-300 sticky top-0 rounded-md mb-6 py-4 px-3 sm:px-6 lg:px-8 font-medium text-gray-900`}
    >
      <span>
        You are viewing documentation generated from a{"  "}
        <b class={tw`font-bold`}>user contribution</b>{"  "}
        or an upcoming release. The contents of this document may not have been
        reviewed by the Deno team.{" "}
      </span>

      <a class={tw`underline cursor-pointer`} href={href}>
        Click here to view the documentation for the latest release.
      </a>
    </div>
  );
}

function ToCEntry({
  slug,
  entry,
  version,
  path,
  outermost,
  depth,
}: {
  slug: string;
  entry: {
    name: string;
    children?: TableOfContents;
  } | string;
  version: string | undefined;
  path: string;
  outermost?: boolean;
  depth: number;
}) {
  const name = typeof entry === "string" ? entry : entry.name;
  const active = path === `/${slug}`;
  const hasChildren = typeof entry === "object" && entry.children;
  return (
    <li key={slug}>
      <input
        type="checkbox"
        id={slug}
        class={tw`hidden checked:siblings:even:children:first-child:rotate-90 checked:siblings:last-child:block`}
        checked={active || path.startsWith(`/${slug}/`)}
        disabled={!hasChildren}
      />

      <label
        htmlFor={slug}
        class={tw`flex! items-center gap-2 ${
          outermost
            ? "px-2.5 py-2 font-semibold"
            : `pl-${depth * 6} pr-2.5 py-1 font-normal`
        } rounded-md ${active ? "link bg-ultralight" : "hover:text-gray-500"}`}
      >
        <Icons.TriangleRight
          aria-label={`open section ${name}`}
          onKeyDown="if (event.code === 'Space' || event.code === 'Enter') { this.parentElement.click(); event.preventDefault(); }"
          tabindex={0}
          class={"h-2.5 w-auto cursor-pointer " +
            (hasChildren ? "" : "invisible")}
        />
        <a href={`/manual@${version}/${slug}`}>
          {name}
        </a>
      </label>

      {hasChildren && (
        <ol class={tw`list-decimal font-normal hidden` + " nested"}>
          {Object.entries(entry.children!).map(([childSlug, entry]) => (
            <ToCEntry
              slug={`${slug}/${childSlug}`}
              entry={entry}
              version={version}
              path={path}
              depth={depth + 1}
            />
          ))}
        </ol>
      )}
    </li>
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
      <ol class={tw`list-decimal list-inside font-semibold` + " nested"}>
        {Object.entries(tableOfContents).map(([slug, entry]) => (
          <ToCEntry
            slug={slug}
            entry={entry}
            version={version}
            path={path}
            outermost
            depth={0}
          />
        ))}
      </ol>
    </nav>
  );
}

export const handler: Handlers<Data> = {
  async GET(req, { params, render }) {
    const url = new URL(req.url);
    const { version, path } = params;
    if (!version || !path) {
      url.pathname = `/manual@${version || versions[0]}/${
        path || "introduction"
      }`;
      return Response.redirect(url);
    }
    if (url.pathname.endsWith(".md")) {
      url.pathname = url.pathname.slice(0, -3);
      return Response.redirect(url);
    }

    const sourceURL = getFileURL(version, `/${params.path}`);
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
