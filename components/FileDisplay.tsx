// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { RawCodeBlock } from "./CodeBlock.tsx";
import { Markdown } from "./Markdown.tsx";
import {
  fileNameFromURL,
  fileTypeFromURL,
  filetypeIsJS,
  isReadme,
} from "@/util/registry_utils.ts";
import * as Icons from "./Icons.tsx";

export function FileDisplay(props: {
  isStd: boolean;
  version: string;
  raw?: string;
  canonicalPath: string;
  sourceURL: string;
  filetypeOverride?: string;
  repositoryURL?: string | null;
  url: URL;
}) {
  const filetype = props.filetypeOverride ?? fileTypeFromURL(props.sourceURL);
  const filename = fileNameFromURL(props.sourceURL);

  let doc = new URL(props.url);
  doc.searchParams.delete("code");
  if (!props.isStd) {
    doc = new URL("https://doc.deno.land/" + doc.href);
  }

  const isRaw = props.url.searchParams.has("raw");
  const raw = new URL(props.url);
  raw.searchParams.set("raw", "");
  const preview = new URL(props.url);
  preview.searchParams.delete("raw");

  return (
    <div
      class={tw`shadow-sm rounded-lg border border-gray-200 overflow-hidden bg-white`}
    >
      <div
        class={tw`bg-gray-100 border-b border-gray-200 py-2 flex justify-between ${
          filetype === "markdown" ? "pl-4 pr-2" : "px-4"
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
          {filetypeIsJS(filetype) &&
            (
              <div class={tw`ml-4`}>
                <a href={doc.href} class={tw`link`}>Documentation</a>
              </div>
            )}
          {filetype === "markdown" && (
            <div
              class={tw`inline-flex ml-4 flex-nowrap shadow-sm rounded-md`}
            >
              <a
                href={preview.href}
                class={tw`relative inline-flex items-center px-1.5 py-1.5 rounded-l-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  !isRaw ? "bg-white" : "bg-gray-100"
                }`}
              >
                <span class={tw`sr-only`}>Preview</span>
                <Icons.Page />
              </a>
              <a
                href={raw.href}
                class={tw`-ml-px relative inline-flex items-center px-1.5 py-1.5 rounded-r-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                  isRaw ? "bg-white" : "bg-gray-100"
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
                url={props.url}
              />
            );
          case "html":
            return (
              <RawCodeBlock
                code={props.raw!}
                language="markdown"
                enableLineRef={true}
                class={tw`p-2 sm:px-3 md:px-4`}
                url={props.url}
              />
            );
          case "markdown": {
            if (isRaw) {
              return (
                <RawCodeBlock
                  code={props.raw!}
                  language="markdown"
                  enableLineRef={true}
                  class={tw`p-2 sm:px-3 md:px-4`}
                  url={props.url}
                />
              );
            } else {
              return (
                <div class={tw`p-8`}>
                  <Markdown
                    source={props.isStd
                      ? props.raw!
                      : props.raw!.replace(/\$STD_VERSION/g, props.version)}
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
                url={props.url}
              />
            );
        }
      })()}
    </div>
  );
}
