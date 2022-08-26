// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { RawCodeBlock } from "./CodeBlock.tsx";
import { Markdown } from "./Markdown.tsx";
import { fileTypeFromURL } from "@/util/registry_utils.ts";
import * as Icons from "./Icons.tsx";

export function FileDisplay(props: {
  isStd: boolean;
  version: string;
  raw?: string;
  sourceURL: string;
  filetypeOverride?: string;
  repositoryURL: string;
  url: URL;
  docable?: boolean;
}) {
  const filetype = props.filetypeOverride ?? fileTypeFromURL(props.sourceURL);

  const doc = new URL(props.url);
  doc.searchParams.delete("source");

  return (
    <div class={tw`border border-gray-200 rounded-lg`}>
      <div
        class={tw`py-3 px-5 flex justify-between items-center border-b border-gray-200`}
      >
        <div class={tw`flex items-center gap-2`}>
          <Icons.Source class="text-gray-500" />
          <span class={tw`text-lg leading-5 font-semibold`}>File</span>
        </div>
        <div
          class={tw`flex items-center gap-3 children:(border border-dark-border rounded p-2 hover:bg-ultralight)`}
        >
          <a href={props.repositoryURL} title="Repository URL">
            <Icons.GitHub class="h-4 w-auto" />
          </a>
          {props.docable && (
            <a href={doc.href} title="Documentation">
              <Icons.Docs class="h-4 w-auto" />
            </a>
          )}
        </div>
      </div>

      <div>
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
                  class={tw`p-2 sm:px-3 md:px-4`}
                  url={props.url}
                  enableLineRef
                />
              );
            case "markdown": {
              return (
                <div class={tw`p-6`}>
                  <Markdown
                    source={props.isStd
                      ? props.raw!
                      : props.raw!.replace(/\$STD_VERSION/g, props.version)}
                  />
                </div>
              );
            }
            case "image":
              return <img class={tw`w-full`} src={props.sourceURL} />;
            default:
              return (
                <RawCodeBlock
                  code={props.raw!}
                  language="text"
                  class={tw`p-2 sm:px-3 md:px-4`}
                  url={props.url}
                  enableLineRef
                />
              );
          }
        })()}
      </div>
    </div>
  );
}
