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
import { ManualOrAPI, SidePanelPage } from "@/components/SidePanelPage.tsx";
import { versions } from "@/util/manual_utils.ts";
import VersionSelect from "@/islands/VersionSelect.tsx";
import {
  getLibDocPageDescription,
  type LibDocPage,
} from "@/util/registry_utils.ts";
import { ErrorMessage } from "@/components/ErrorMessage.tsx";
import { LibraryDocPanel } from "$doc_components/doc/library_doc_panel.tsx";
import { LibraryDoc } from "$doc_components/doc/library_doc.tsx";
import { SymbolDoc } from "$doc_components/doc/symbol_doc.tsx";

export default function API(
  { params, url, data }: PageProps<LibDocPage>,
) {
  const replacer: [string, string][] = [[
    "**UNSTABLE**: New API, yet to be vetted.\n",
    "",
  ]];

  return (
    <>
      <ContentMeta
        title={data.kind === "librarySymbol"
          ? `${data.name} | Runtime APIs`
          : "Runtime APIs"}
        description={getLibDocPageDescription(data)}
        creator="@deno_land"
        keywords={["deno", "api", "built-in", "typescript", "javascript"]}
      />
      <Header selected="API" manual />

      {data.kind === "libraryInvalidVersion"
        ? (
          <div class={tw`section-x-inset-xl pb-20 pt-10 py-12`}>
            <ErrorMessage title="404 - Not Found">
              This version does not exist.
            </ErrorMessage>
          </div>
        )
        : (
          <SidePanelPage
            sidepanel={
              <>
                <ManualOrAPI current="Runtime APIs" version={params.version} />
                <div class={tw`space-y-2.5 children:w-full`}>
                  <VersionSelect
                    versions={Object.fromEntries(
                      versions.map((
                        ver,
                      ) => [
                        ver,
                        `/api@${ver}?${url.searchParams}`,
                      ]),
                    )}
                    selectedVersion={params.version}
                  />
                  <label class={tw`flex items-center gap-1.5`}>
                    <input
                      type="checkbox"
                      checked={url.searchParams.has("unstable")}
                      // @ts-ignore onChange does support strings
                      onChange="const search = new URLSearchParams(location.search); if (event.currentTarget.checked) { search.set('unstable', '') } else { search.delete('unstable') } location.search = search.toString() "
                    />
                    <span>Show Unstable API</span>
                  </label>
                </div>
                {
                  <LibraryDocPanel
                    base={url}
                    currentSymbol={data.kind === "librarySymbol"
                      ? data.name
                      : undefined}
                  >
                    {data.items}
                  </LibraryDocPanel>
                }
              </>
            }
          >
            {data.kind === "librarySymbol"
              ? (
                data.docNodes.length === 0
                  ? (
                    <ErrorMessage title="404 - Not Found">
                      This symbol does not exist.
                    </ErrorMessage>
                  )
                  : (
                    // @ts-ignore it works.
                    <SymbolDoc
                      url={url}
                      name={data.name}
                      replacers={replacer}
                      library
                    >
                      {data.docNodes}
                    </SymbolDoc>
                  )
              )
              : (
                <LibraryDoc
                  url={url}
                  sourceUrl={`https://github.com/denoland/deno/releases/download/${data.version}/lib.deno.d.ts`}
                  jsDoc={!url.searchParams.has("unstable")
                    ? "There are APIs that are built into the Deno CLI that are beyond those that are built-ins for JavaScript. They are a combination of web platform APIs Deno has implemented and Deno specific APIs." +
                      "\n\nWe try to keep non-standard, Deno specific, APIs in the {@linkcode Deno} namespace. We have grouped the APIs into the following functional categories."
                    : "There are APIs that are built into the Deno CLI that are beyond those that are built-ins for JavaScript, including APIs that are unstable or experimental. In order to use APIs marked as unstable, you will need to use `--unstable` on the command line to make them available. All the APIs are a combination of web platform APIs Deno has implemented and Deno specific APIs." +
                      "\n\nWe try to keep non-standard, Deno specific, APIs in the {@linkcode Deno} namespace. We have grouped the APIs into the following functional categories."}
                  replacers={replacer}
                >
                  {data.items}
                </LibraryDoc>
              )}
          </SidePanelPage>
        )}

      <Footer />
    </>
  );
}

export const handler: Handlers<LibDocPage> = {
  async GET(req, { params, render }) {
    const url = new URL(req.url);

    if (!params.version) {
      url.pathname = `/api@${versions[0]}`;
      return Response.redirect(url, 302);
    }

    const resURL = new URL(
      `https://apiland.deno.dev/v2/pages/lib/doc/${
        url.searchParams.has("unstable") ? "deno_unstable" : "deno_stable"
      }/${params.version}`,
    );

    const symbol = url.searchParams.get("s");
    if (symbol) {
      resURL.searchParams.set("symbol", symbol);
    }

    const res = await fetch(resURL);
    const data = await res.json();

    return render!(data);
  },
};

export const config: RouteConfig = {
  routeOverride: "/api{@:version}?",
};
