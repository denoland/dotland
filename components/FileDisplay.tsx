// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "$fresh/runtime.ts";
import { tw } from "twind";
import { RawCodeBlock } from "./CodeBlock.tsx";
import { Markdown } from "./Markdown.tsx";
import {
  fileNameFromURL,
  fileTypeFromURL,
  isReadme,
} from "@/util/registry_utils.ts";
import * as Icons from "./Icons.tsx";

export function FileDisplay(props: {
  showCode: boolean;
  raw?: string;
  canonicalPath: string;
  sourceURL: string;
  baseURL: string;
  filetypeOverride?: string;
  repositoryURL?: string | null;
  documentationURL?: string | null;
  stdVersion?: string;
  pathname: string;
}) {
  const filetype = props.filetypeOverride ?? fileTypeFromURL(props.sourceURL);
  const filename = fileNameFromURL(props.sourceURL);

  return (
    <div
      class={tw
        `shadow-sm rounded-lg border border-gray-200 overflow-hidden bg-white`}
    >
      <div
        class={tw
          `bg-gray-100 border-b border-gray-200 py-2 flex justify-between ${
            filetype === "markdown" ? "pl-4 pr-2" : "px-4"
          }`}
      >
        <div class={tw`flex items-center`}>
          {isReadme(filename) && <Icons.LightOpenBook />}
          <span class={tw`font-medium`}>
            {props.canonicalPath === props.pathname
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
          {filetype === "markdown" && (
            <div class={tw`inline-block ml-4 inline-flex shadow-sm rounded-md`}>
              <a
                href={props.pathname}
                class={tw
                  `relative inline-flex items-center px-1.5 py-1.5 rounded-l-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    props.showCode ? "bg-white" : "bg-gray-100"
                  }`}
              >
                <span class={tw`sr-only`}>Preview</span>
                <icons.Page />
              </a>
              <a
                href={props.pathname + "?showCode"}
                class={tw
                  `-ml-px relative inline-flex items-center px-1.5 py-1.5 rounded-r-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    !props.showCode ? "bg-white" : "bg-gray-100"
                  }`}
              >
                <span class={tw`sr-only`}>Code</span>
                <Icons.Code />
              </a>
            </div>
          )}
        </div>
      </div>
      {props.documentationURL && (
        <a
          href={props.documentationURL}
          class={tw
            `bg-gray-100 border-b border-gray-200 py-1 px-4 flex align-middle justify-between link group`}
        >
          <span>
            <Icons.OpenBook />
          </span>
          View Documentation
        </a>
      )}
      {(() => {
        switch (filetype) {
          case "javascript":
          case "typescript":
          case "tsx":
          case "jsx":
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
            if (props.showCode) {
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
