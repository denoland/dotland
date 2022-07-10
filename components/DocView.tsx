// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { ComponentChildren, Fragment, h } from "preact";
import { tw } from "@twind";
import { type CommonProps, getBasePath } from "@/util/registry_utils.ts";
import { type Doc, type DocNode } from "@/util/doc.ts";
import { dirname } from "$std/path/mod.ts";
import { ModuleDoc } from "$doc_components/module_doc.tsx";
import { ModulePathIndex } from "$doc_components/module_path_index.tsx";
import { ModulePathIndexPanel } from "$doc_components/module_path_index_panel.tsx";
import { FileDisplay } from "./FileDisplay.tsx";
import { SymbolDoc } from "../doc_components/symbol_doc.tsx";

export function DocView({
  doc,
  index,
  symbol,

  isStd,
  name,
  version,
  path,

  readme,

  basePath,
  url,
}: Doc & CommonProps) {
  const baseURL = `https://deno.land${basePath}`;

  return (
    <>
      {(doc || index.indexModule) && (
        <ModulePathIndexPanel
          base={getBasePath({
            isStd,
            name,
            version,
          })}
          path={(doc ? dirname(path) : path) || "/"}
          current={path}
        >
          {index.index}
        </ModulePathIndexPanel>
      )}
      <div class={tw`space-y-12 flex flex-col gap-4 w-full overflow-auto`}>
        {doc
          ? (
            <ModuleOrSymbolDoc url={url.href} symbol={symbol}>
              {doc}
            </ModuleOrSymbolDoc>
          )
          : (
            <div class={tw`space-y-12`}>
              {index.indexModule
                ? (
                  <ModuleOrSymbolDoc
                    url={url.href}
                    indexModule={baseURL + index.indexModule}
                  >
                    {index.nodes}
                  </ModuleOrSymbolDoc>
                )
                : (
                  <ModulePathIndex
                    base={basePath}
                    path={path || "/"}
                    skipMods={!!index.indexModule}
                    sourceUrl={url.href}
                  >
                    {index.index}
                  </ModulePathIndex>
                )}
            </div>
          )}

        {readme && (
          <FileDisplay
            isStd={isStd}
            version={version}
            raw={readme.content}
            canonicalPath={readme.canonicalPath}
            sourceURL={readme.url}
            repositoryURL={readme.repositoryURL}
            baseURL={basePath}
            url={url}
          />
        )}
      </div>
    </>
  );
}

function ModuleOrSymbolDoc({
  symbol,
  children,
  url,
  indexModule,
}: {
  symbol?: string;
  url: string;
  children: DocNode[];
  indexModule?: string;
}) {
  if (symbol) {
    const itemNodes = children.filter(({ name }) => name === symbol);
    url = url.split("/~/")[0];
    return (
      <SymbolDoc url={url} namespace={undefined}>
        {itemNodes}
      </SymbolDoc>
    );
  } else {
    return (
      <ModuleDoc url={indexModule ?? url} sourceUrl={url}>
        {children}
      </ModuleDoc>
    );
  }
}
