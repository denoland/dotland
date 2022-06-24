// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { runtime } from "$doc_components/services.ts";
import { tw } from "@twind";
import { RawCodeBlock } from "./CodeBlock.tsx";
import { Markdown } from "./Markdown.tsx";
import {
  fileNameFromURL,
  fileTypeFromURL,
  isReadme,
} from "@/util/registry_utils.ts";
import * as Icons from "./Icons.tsx";
import { ModuleDoc } from "$doc_components/module_doc.tsx";
import type { DocNode } from "@/util/doc.ts";

export function FileDisplay(props: {
  raw?: string;
  canonicalPath: string;
  sourceURL: string;
  baseURL: string;
  filetypeOverride?: string;
  repositoryURL?: string | null;
  stdVersion?: string;
  url: URL;
  docNodes: DocNode[] | null;
}) {
  const filetype = props.filetypeOverride ?? fileTypeFromURL(props.sourceURL);
  const filename = fileNameFromURL(props.sourceURL);
  const hasToggle = (filetype === "markdown" || (props.docNodes !== null));

  const codeview = props.url.searchParams.has("codeview");
  const searchDoc = new URL(props.url);
  searchDoc.searchParams.delete("codeview");
  const searchCode = new URL(props.url);
  searchCode.searchParams.set("codeview", "");

  return (
    <div
      class={tw
        `shadow-sm rounded-lg border border-gray-200 overflow-hidden bg-white`}
    >
      <div
        class={tw
          `bg-gray-100 border-b border-gray-200 py-2 flex justify-between ${
            hasToggle ? "pl-4 pr-2" : "px-4"
          }`}
      >
        <div class={tw`flex items-center`}>
          {isReadme(filename) && (
            <span class={tw`hidden sm:inline-block`}>
              <Icons.LightOpenBook />
            </span>
          )}
          <span class={tw`font-medium`}>
            {props.canonicalPath === props.url.pathname
              ? filename
              : (
                <a href={props.canonicalPath} class={tw`link`}>
                  {filename}
                </a>
              )}
          </span>
        </div>
        <div class={tw`inline-flex items-center`}>
          <div>
            {props.sourceURL && (
              <a href={props.sourceURL} class={tw`link ml-4`}>
                Raw
              </a>
            )}
            {props.repositoryURL &&
              (
                <a href={props.repositoryURL} class={tw`link ml-2 sm:ml-4`}>
                  Repository
                </a>
              )}
          </div>
          {hasToggle && (
            <div
              class={tw`inline-flex ml-4 flex-nowrap shadow-sm rounded-md`}
            >
              <a
                href={searchDoc.href}
                class={tw
                  `relative inline-flex items-center px-1.5 py-1.5 rounded-l-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    !codeview ? "bg-white" : "bg-gray-100"
                  }`}
              >
                {filetype === "markdown"
                  ? (
                    <>
                      <span class={tw`sr-only`}>Preview</span>
                      <Icons.Page />
                    </>
                  )
                  : (
                    <>
                      <span class={tw`sr-only`}>Documentation</span>
                      <Icons.OpenBook />
                    </>
                  )}
              </a>
              <a
                href={searchCode.href}
                class={tw
                  `-ml-px relative inline-flex items-center px-1.5 py-1.5 rounded-r-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    codeview ? "bg-white" : "bg-gray-100"
                  }`}
              >
                <span class={tw`sr-only`}>Code</span>
                <Icons.Code />
              </a>
            </div>
          )}
        </div>
      </div>
      {(() => {
        switch (filetype) {
          case "javascript":
          case "typescript":
          case "tsx":
          case "jsx":
            if (!codeview && props.docNodes) {
              return (
                <ModuleDoc url={props.url.href}>
                  {props.docNodes}
                </ModuleDoc>
              );
            }
          /* falls through */
          case "json":
          case "yaml":
          case "rust":
          case "toml":
          case "python":
          case "wasm":
          case "makefile":
          case "dockerfile":
            return (
              <RawCodeBlock
                code={props.raw!}
                language={filetype}
                enableLineRef={true}
                class={tw`p-2 sm:px-3 md:px-4`}
              />
            );
          case "html":
            return (
              <RawCodeBlock
                code={props.raw!}
                language="markdown"
                enableLineRef={true}
                class={tw`p-2 sm:px-3 md:px-4`}
              />
            );
          case "markdown": {
            if (codeview) {
              return (
                <RawCodeBlock
                  code={props.raw!}
                  language="markdown"
                  enableLineRef={true}
                  class={tw`p-2 sm:px-3 md:px-4`}
                />
              );
            } else {
              return (
                <div class={tw`px-4`}>
                  <Markdown
                    source={props.stdVersion === undefined
                      ? props.raw!
                      : props.raw!.replace(
                        /\$STD_VERSION/g,
                        props.stdVersion ?? "",
                      )}
                  />
                </div>
              );
            }
          }
          case "image":
            return <img class={tw`w-full`} src={props.sourceURL} />;
          default:
            return (
              <RawCodeBlock
                code={props.raw!}
                language="text"
                enableLineRef={true}
                class={tw`p-2 sm:px-3 md:px-4`}
              />
            );
        }
      })()}
    </div>
  );
}
