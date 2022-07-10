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
            <ModuleDoc url={url.href} sourceHref={baseURL + path + "?code"}>
              {doc}
            </ModuleDoc>
          )
          : (
            <div class={tw`space-y-12`}>
              {index.indexModule
                ? (
                  <ModuleDoc
                    url={baseURL + index.indexModule}
                    sourceHref={baseURL + path + "?code"}
                  >
                    {index.nodes}
                  </ModuleDoc>
                )
                : (
                  <ModulePathIndex
                    base={basePath}
                    path={path || "/"}
                    skipMods={!!index.indexModule}
                    sourceHref={url.href + "?code"}
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
