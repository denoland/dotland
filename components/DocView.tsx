// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "@twind";
import { type CommonProps, getModulePath } from "@/util/registry_utils.ts";
import { dirname } from "$std/path/mod.ts";
import { ModuleDoc } from "$doc_components/module_doc.tsx";
import { ModulePathIndex } from "$doc_components/module_path_index.tsx";
import { ModulePathIndexPanel } from "$doc_components/module_path_index_panel.tsx";
import { SymbolDoc } from "$doc_components/symbol_doc.tsx";
import {
  DocPageIndex,
  DocPageModule,
  DocPageSymbol,
} from "@/util/registry_utils.ts";
import { SidePanelPage } from "./SidePanelPage.tsx";

export function DocView({
  name,
  version,
  path,
  url,
  data,
}: CommonProps<DocPageSymbol | DocPageModule | DocPageIndex>) {
  const basePath = getModulePath(name, version);
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
      <div class={tw`w-full`}>
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
      </div>
    </SidePanelPage>
  );
}
