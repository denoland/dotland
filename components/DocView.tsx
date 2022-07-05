// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "@twind";
import { type CommonProps, getBasePath } from "@/util/registry_utils.ts";
import { Doc } from "@/util/doc.ts";
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
            <div>
              <ModuleDoc url={url.href}>
                {doc}
              </ModuleDoc>
            </div>
          )
          : (
            <div class={tw`space-y-12`}>
              <ModulePathIndex
                base={basePath}
                path={path || "/"}
                skipMods={!!index.indexModule}
              >
                {index.index}
              </ModulePathIndex>
              {index.indexModule && (
                <ModuleDoc url={`${baseURL}${index.indexModule}`}>
                  {index.nodes}
                </ModuleDoc>
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
