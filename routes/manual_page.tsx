// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import { PageProps, RouteConfig } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { ContentMeta } from "@/components/ContentMeta.tsx";
import { Header } from "@/components/Header.tsx";
import { Footer } from "$doc_components/footer.tsx";
import { Markdown } from "@/components/Markdown.tsx";
import {
  collectToC,
  getFileURL,
  getTableOfContents,
  isPreviewVersion,
  versions,
} from "@/utils/manual_utils.ts";
import { UserContributionBanner } from "./manual.tsx";

import VERSIONS from "@/versions.json" assert { type: "json" };

interface Data {
  allContent: [string, string][];
  version: string;
}

export default function Manual({ params, url, data }: PageProps<Data>) {
  const stdVersion = ((VERSIONS.cli_to_std as Record<string, string>)[
    data.version
  ]) ?? VERSIONS.std[0];

  const isPreview = isPreviewVersion(data.version);

  return (
    <>
      <ContentMeta
        title="Full Manual"
        description="Entire Deno manual on a single page"
        creator="@deno_land"
        ogType="article"
        ogImage="manual"
        keywords={[
          "deno",
          "manual",
          "documentation",
          "javascript",
          "typescript",
        ]}
      />
      <Header manual />

      {isPreview && (
        <UserContributionBanner
          href={new URL(`/manual/${params.path}`, url).href}
        />
      )}
      <div class="w-full mb-16 flex flex-col justify-self-center children:flex-shrink-1 lg:(mt-12 gap-12 section-x-inset-xl)">
        {data.allContent.map(([sourceURL, content]) => (
          <Markdown
            source={content
              .replace(/(\[.+\]\((?!https?:).+)\.md(\))/g, "$1$2")
              .replaceAll("$STD_VERSION", stdVersion)
              .replaceAll("$CLI_VERSION", data.version)}
            mediaBaseURL={sourceURL}
          />
        ))}
      </div>
      <Footer />
    </>
  );
}

export const handler: Handlers<Data> = {
  async GET(req, { params, render }) {
    const url = new URL(req.url);
    const { version } = params;
    if (!version) {
      url.pathname = `/manual@${version || versions[0]}/page`;
      return Response.redirect(url);
    }
    if (url.pathname.endsWith(".md")) {
      url.pathname = url.pathname.slice(0, -3);
      return Response.redirect(url);
    }

    const tableOfContent = collectToC(await getTableOfContents(version));

    const allContent: [string, string][] = await Promise.all(
      tableOfContent.map(async (path) => {
        const sourceURL = getFileURL(version, `/${path}`);
        return [
          sourceURL,
          await fetch(sourceURL)
            .then(async (res) => {
              if (res.status === 404 || res.status === 403) {
                return "# 404 - Not Found\nWhoops, the page does not seem to exist.";
              } else if (res.status !== 200) {
                await res.body?.cancel();
                throw Error(
                  `Got an error (${res.status}) while getting the documentation file (${sourceURL}).`,
                );
              }
              return res.text();
            })
            .catch((e) => {
              console.error("Failed to fetch content:", e);
              return "# 500 - Internal Server Error\nSomething went wrong.";
            }),
        ];
      }),
    );

    return render!({ allContent, version });
  },
};

export const config: RouteConfig = {
  routeOverride: "/manual{@:version}?/page",
};
