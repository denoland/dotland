// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { runtime } from "$doc_components/services.ts";
import { tw } from "_twind";
import { RawCodeBlock } from "./CodeBlock.tsx";
import { Markdown } from "./Markdown.tsx";
import {
  fileNameFromURL,
  fileTypeFromURL,
  isReadme,
} from "@/util/registry_utils.ts";
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
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              class={tw`w-6 h-6 text-gray-400 inline-block mr-2`}
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z">
              </path>
            </svg>
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
                <a href={props.repositoryURL} class={tw`link ml-4`}>
                  Repository
                </a>
              )}
          </div>
          {hasToggle && (
            <div class={tw`inline-block ml-4 inline-flex shadow-sm rounded-md`}>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </>
                  )
                  : (
                    <>
                      <span class={tw`sr-only`}>Documentation</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
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
