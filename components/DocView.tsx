// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "@twind";
import { type CommonProps, getModulePath } from "@/util/registry_utils.ts";
import { dirname } from "$std/path/mod.ts";
import { ModuleDoc } from "$doc_components/doc/module_doc.tsx";
import { ModuleIndex } from "$doc_components/doc/module_index.tsx";
import { ModuleIndexPanel } from "$doc_components/doc/module_index_panel.tsx";
import { SymbolDoc } from "$doc_components/doc/symbol_doc.tsx";
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

  return (
    <SidePanelPage
      sidepanel={(data.kind === "module" || data.kind === "symbol")
        ? (
          <ModuleIndexPanel
            base={basePath}
            path={dirname(path)}
            current={path}
            currentSymbol={data.kind === "symbol" ? data.name : undefined}
          >
            {data.nav}
          </ModuleIndexPanel>
        )
        : null}
    >
      <div class={tw`w-full`}>
        {(() => {
          switch (data.kind) {
            case "index":
              return (
                <ModuleIndex
                  base={basePath}
                  path={path || "/"}
                  sourceUrl={url.href}
                >
                  {data.items}
                </ModuleIndex>
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
