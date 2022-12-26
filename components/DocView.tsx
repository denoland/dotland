// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { type CommonProps, getModulePath } from "@/util/registry_utils.ts";
import { dirname } from "$std/path/mod.ts";
import { ModuleDoc } from "$doc_components/doc/module_doc.tsx";
import { ModuleIndex } from "$doc_components/doc/module_index.tsx";
import { ModuleIndexPanel } from "$doc_components/doc/module_index_panel.tsx";
import { SymbolDoc } from "$doc_components/doc/symbol_doc.tsx";
import type {
  DocPageIndex,
  DocPageModule,
  DocPageSymbol,
} from "$apiland_types";
import { SidePanelPage } from "./SidePanelPage.tsx";

export function DocView({
  name,
  version,
  path,
  url,

  data,
}: CommonProps<DocPageSymbol | DocPageModule | DocPageIndex>) {
  const replacer: [string, string][] = name === "std"
    ? [["$STD_VERSION", version]]
    : [];
  replacer.push(["$MODULE_VERSION", version]);

  const baseUrl = new URL(url);
  baseUrl.pathname = getModulePath(name, version);

  return (
    <SidePanelPage
      sidepanel={(data.kind === "module" || data.kind === "symbol")
        ? (
          <ModuleIndexPanel
            base={baseUrl}
            path={dirname(path)}
            current={path}
            currentSymbol={data.kind === "symbol" ? data.name : undefined}
          >
            {data.nav}
          </ModuleIndexPanel>
        )
        : null}
    >
      <div class="w-full">
        {(() => {
          switch (data.kind) {
            case "index":
              return (
                <ModuleIndex
                  url={baseUrl}
                  path={path || "/"}
                  sourceUrl={url.href}
                  replacers={replacer}
                >
                  {data.items}
                </ModuleIndex>
              );
            case "symbol":
              return (
                // @ts-ignore it works.
                <SymbolDoc
                  url={url}
                  name={data.name}
                  replacers={replacer}
                  property={url.searchParams.get("p") ?? undefined}
                >
                  {data.docNodes}
                </SymbolDoc>
              );
            case "module":
              return (
                // @ts-ignore it works.
                <ModuleDoc
                  url={url}
                  sourceUrl={url.href}
                  replacers={replacer}
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
