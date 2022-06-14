// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { runtime } from "$doc_components/services.ts";
import { tw } from "@twind";
import { DirListing, getBasePath } from "@/util/registry_utils.ts";
import { DirectoryView } from "./DirectoryView.tsx";
import * as Icons from "./Icons.tsx";

import { type Index } from "@/util/doc.ts";
import { ModulePathIndex } from "$doc_components/module_path_index.tsx";
import { ModuleDoc } from "$doc_components/module_doc.tsx";

export function DirectoryListing(props: {
  dirListing: DirListing[];
  name: string;
  version: string | undefined;
  path: string;
  repositoryURL?: string | null;
  url: URL;
  index: Index;
}) {
  const isStd = props.url.pathname.startsWith("/std");
  const basePath = getBasePath({
    isStd: isStd,
    name: props.name,
    version: props.version,
  });
  const baseURL = `https://deno.land${basePath}`;
  const dirview = props.url.searchParams.has("dirview");
  const searchDoc = new URL(props.url);
  searchDoc.searchParams.delete("dirview");
  const searchDir = new URL(props.url);
  searchDir.searchParams.set("dirview", "");

  return (
    <div class={tw`flex flex-col overflow-x-auto`}>
      <div
        class={tw
          `inline-block min-w-full shadow-sm rounded-lg border border-gray-200 overflow-hidden`}
      >
        <div
          class={tw
            `bg-gray-100 border-b border-gray-200 py-2 flex justify-between pl-4 ${
              props.index ? "pr-2" : "pr-4"
            }`}
        >
          <div class={tw`flex items-center`}>
            <Icons.Folder />
            <span class={tw`ml-2 font-medium`}>{props.path || "/"}</span>
          </div>
          <div class={tw`inline-flex items-center`}>
            <div>
              {props.repositoryURL &&
                (
                  <a href={props.repositoryURL} class={tw`link ml-4`}>
                    Repository
                  </a>
                )}
            </div>
            {props.index && (
              <div
                class={tw`inline-block ml-4 inline-flex shadow-sm rounded-md`}
              >
                <a
                  href={searchDoc.href}
                  class={tw
                    `relative inline-flex items-center px-1.5 py-1.5 rounded-l-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      !dirview ? "bg-white" : "bg-gray-100"
                    }`}
                >
                  <span class={tw`sr-only`}>Documentation</span>
                  <Icons.OpenBook />
                </a>
                <a
                  href={searchDir.href}
                  class={tw
                    `-ml-px relative inline-flex items-center px-1.5 py-1.5 rounded-r-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      dirview ? "bg-white" : "bg-gray-100"
                    }`}
                >
                  <span class={tw`sr-only`}>Directory Listing</span>
                  <Icons.Code />
                </a>
              </div>
            )}
          </div>
        </div>

        {dirview || (props.index === null)
          ? (
            <DirectoryView
              dirListing={props.dirListing}
              path={props.path}
              url={props.url}
              baseURL={basePath}
            />
          )
          : (
            <div class={tw`bg-white dark:(bg-gray-900 text-white)`}>
              {props.index.index && (
                <ModulePathIndex
                  base={basePath}
                  path={props.path || "/"}
                  skipMods={!!props.index.indexModule}
                >
                  {props.index.index}
                </ModulePathIndex>
              )}
              {props.index.indexModule && (
                <ModuleDoc url={`${baseURL}${props.index.indexModule}`}>
                  {props.index.nodes}
                </ModuleDoc>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
