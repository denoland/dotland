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
  tw,
} from "../../deps.ts";
import { Handlers } from "../../server_deps.ts";
import { Markdown } from "../../components/Markdown.tsx";
import { InlineCode } from "../../components/InlineCode.tsx";
import {
  getFileURL,
  getTableOfContents,
  versions,
} from "../../util/manual_utils.ts";

import versionMeta from "../../versions.json" assert { type: "json" };

interface Data {
  content: string[];
}

export default function Manual({ params, url, data }: PageProps<Data>) {
  const version = params.version || versions[0];
  const stdVersion = ((versionMeta.cli_to_std as Record<string, string>)[
    version
  ]) ?? versionMeta.std[0];

  return (
    <div>
      <Head>
        <title>Manual Print | Deno</title>
      </Head>
      <div class={tw`min-h-screen flex`}>
        <div class={tw`flex flex-col w-0 flex-1`}>
          <main
            class={tw`flex-1 relative z-0 focus:outline-none`}
            tabIndex={0}
          >
            <div
              class={tw
                `max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 pb-12 sm:pb-20`}
            >
              {data.content.map((file) => {
                return (
                  <div class={tw`pt-1`}>
                    <Markdown
                      source={file
                        .replace(/\$STD_VERSION/g, stdVersion)
                        .replace(/\$CLI_VERSION/g, version)}
                      baseUrl={getFileURL(version, "/print/placeholder")}
                    />
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export const handler: Handlers<Data> = {
  async GET(req, { params, render }) {
    const version = params.version || versions[0];

    const tableOfContents = await getTableOfContents(version).then((toc) => {
      const arr: string[] = [];
      Object.entries(toc).map(([slug, entry]) => {
        if (entry.children) {
          Object.entries(entry.children).forEach(([childSlug]) => {
            arr.push(`/${slug}/${childSlug}`);
          });
        }
        arr.push(`/${slug}`);
      });
      return arr.map((e) => getFileURL(version, e));
    });

    const content = await Promise.all(tableOfContents.map((entry) => {
      return fetch(entry)
        .then(async (res) => {
          if (res.status !== 200) {
            await res.body?.cancel();
            throw Error(
              `Got an error (${res.status}) while getting the documentation file (${entry}).`,
            );
          }
          return res.text();
        })
        .catch((e) => {
          console.error("Failed to fetch content:", e);
          return "# 404 - Not Found\nWhoops, the page does not seem to exist.";
        });
    }));

    return render!({ content });
  },
};

export const config: PageConfig = {
  routeOverride: "/manual{@:version}?/print",
};
