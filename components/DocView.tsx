// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "@twind";
import { type CommonProps, getBasePath } from "@/util/registry_utils.ts";
import { type Doc, type DocNode } from "@/util/doc.ts";
import { dirname } from "$std/path/mod.ts";
import { ModuleDoc } from "$doc_components/module_doc.tsx";
import { ModulePathIndex } from "$doc_components/module_path_index.tsx";
import { ModulePathIndexPanel } from "$doc_components/module_path_index_panel.tsx";
import { FileDisplay } from "./FileDisplay.tsx";
import * as Icons from "./Icons.tsx";

export function DocView({
  doc,
  index,

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
            <FileDoc url={url.href} sourceURL={baseURL + path}>
              {doc}
            </FileDoc>
          )
          : (
            <div class={tw`space-y-12`}>
              {index.indexModule
                ? (
                  <FileDoc
                    url={baseURL + index.indexModule}
                    sourceURL={baseURL + path}
                  >
                    {index.nodes}
                  </FileDoc>
                )
                : (
                  <ModulePathIndex
                    base={basePath}
                    path={path || "/"}
                    skipMods={!!index.indexModule}
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

function FileDoc({
  children,
  url,
  sourceURL,
}: {
  sourceURL: string;
  children: DocNode[];
  url: string;
}) {
  return (
    <div>
      <div class={tw`flex justify-between mb-8`}>
        <div>{/* TODO: add module name */}</div>
        <a
          href={sourceURL + "?code"}
          class={tw`rounded-md border border-dark-border p-2`}
        >
          <Icons.SourceFile />
        </a>
      </div>
      <ModuleDoc url={url}>
        {children}
      </ModuleDoc>
    </div>
  );
}
