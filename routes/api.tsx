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
import { ManualOrAPI, SidePanelPage } from "@/components/SidePanelPage.tsx";
import { versions } from "@/util/manual_utils.ts";
import VersionSelect from "@/islands/VersionSelect.tsx";
import { type LibDocPage } from "@/util/registry_utils.ts";
import { ErrorMessage } from "@/components/ErrorMessage.tsx";
import { LibraryCategoryPanel } from "$doc_components/doc/library_category_panel.tsx";
import { SymbolDoc } from "$doc_components/doc/symbol_doc.tsx";
import { type State } from "@/routes/_middleware.ts";

interface Data {
  data: LibDocPage;
  userToken: string;
}

export default function API(
  { params, url, data: { data, userToken } }: PageProps<Data>,
) {
  return (
    <>
      <Head>
        <title>API | Deno</title>
      </Head>
      <Header selected="API" userToken={userToken} manual />

      {data.kind === "libraryInvalidVersion"
        ? (
          <div class={tw`section-x-inset-xl py-12`}>
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
                <div>
                  <VersionSelect
                    versions={Object.fromEntries(
                      versions.map((ver) => [ver, `/api@${ver}`]),
                    )}
                    selectedVersion={params.version}
                  />
                </div>
                {
                  <LibraryCategoryPanel
                    base={url.pathname}
                    currentSymbol={data.kind === "librarySymbol"
                      ? data.name
                      : undefined}
                  >
                    {data.items}
                  </LibraryCategoryPanel>
                }
              </>
            }
          >
            {data.kind === "librarySymbol" && (
              // @ts-ignore it works.
              <SymbolDoc url={url.href} namespace={undefined}>
                {data.docNodes}
              </SymbolDoc>
            )}
          </SidePanelPage>
        )}

      <Footer />
    </>
  );
}

export const handler: Handlers<Data, State> = {
  async GET(req, { params, render, state: { userToken } }) {
    const url = new URL(req.url);

    if (!params.version) {
      url.pathname = `/api@${versions[0]}`;
      return Response.redirect(url, 302);
    }

    const resURL = new URL(
      `https://apiland.deno.dev/v2/pages/lib/doc/deno_stable/${params.version}`,
    );

    const symbol = url.searchParams.get("s");
    if (symbol) {
      resURL.searchParams.set("symbol", symbol);
    }

    const res = await fetch(resURL);
    const data = await res.json();

    return render!({ data, userToken });
  },
};

export const config: RouteConfig = {
  routeOverride: "/api{@:version}?",
};
