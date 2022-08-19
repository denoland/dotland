// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "@twind";
import { type CommonProps, getBasePath } from "@/util/registry_utils.ts";
import { dirname } from "$std/path/mod.ts";
import { ModuleDoc } from "$doc_components/module_doc.tsx";
import { ModulePathIndex } from "$doc_components/module_path_index.tsx";
import { ModulePathIndexPanel } from "$doc_components/module_path_index_panel.tsx";
import { FileDisplay } from "./FileDisplay.tsx";
import { SymbolDoc } from "$doc_components/symbol_doc.tsx";
import {
  DocPageIndex,
  DocPageModule,
  DocPageSymbol,
} from "@/util/registry_utils.ts";
import { SidePanelPage } from "./SidePanelPage.tsx";

export function DocView({
  isStd,
  name,
  version,
  path,
  url,

  data,
}: CommonProps & {
  data: DocPageSymbol | DocPageModule | DocPageIndex;
}) {
  const basePath = getBasePath({
    isStd,
    name,
    version,
  });
  url.search = "";

  return (
    <SidePanelPage
      sidepanel={(data.kind === "module" || data.kind === "symbol")
        ? (
          <ModulePathIndexPanel
            base={basePath}
            path={dirname(path)}
            current={path}
            currentSymbol={data.kind === "symbol" ? data.name : undefined}
          >
            {data.nav}
          </ModulePathIndexPanel>
        )
        : null}
    >
      <div class={tw`space-y-12 flex flex-col gap-4 w-full`}>
        {(() => {
          switch (data.kind) {
            case "index":
              return (
                <ModulePathIndex
                  base={basePath}
                  path={path || "/"}
                  sourceUrl={url.href}
                >
                  {data.items}
                </ModulePathIndex>
              );
            case "symbol":
              return (
                // @ts-ignore it works.
                <SymbolDoc url={url.href} namespace={undefined}>
                  {data.docNodes}
                </SymbolDoc>
              );
            case "module":
              return (
                // @ts-ignore it works.
                <ModuleDoc
                  url={url.href}
                  sourceUrl={url.href}
                >
                  {data.docNodes}
                </ModuleDoc>
              );
          }
        })()}

        {data.kind === "index" && data.readme && (
          <FileDisplay
            isStd={isStd}
            version={version}
            raw={data.readme.content}
            canonicalPath={data.readme.canonicalPath}
            sourceURL={data.readme.url}
            repositoryURL={data.readme.repositoryURL}
            url={url}
          />
        )}
      </div>
    </SidePanelPage>
  );
}
