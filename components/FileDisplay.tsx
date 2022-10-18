// Copyright 2022 the Deno authors. All rights reserved. MIT license.

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
    <div class="border border-gray-200 rounded-lg">
      <div class="py-3 px-5 flex justify-between items-center border-b border-gray-200">
        <div class="flex items-center gap-2">
          <Icons.Source class="text-gray-500" />
          <span class="text-lg leading-5 font-semibold">File</span>
        </div>
        <div class="flex items-center gap-3">
          <a
            href={props.repositoryURL}
            title="Repository URL"
            class="icon-button"
          >
            <Icons.GitHub class="h-4 w-auto" />
          </a>
          {props.docable && (
            <a href={doc.href} title="Documentation" class="icon-button">
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
                  class="p-2 sm:px-3 md:px-4"
                  url={props.url}
                />
              );
            case "html":
              return (
                <RawCodeBlock
                  code={props.raw!}
                  language="markdown"
                  class="p-2 sm:px-3 md:px-4"
                  url={props.url}
                  enableLineRef
                />
              );
            case "markdown": {
              return (
                <div class="p-6">
                  <Markdown
                    source={props.isStd
                      ? props.raw!
                      : props.raw!.replace(/\$STD_VERSION/g, props.version)}
                  />
                </div>
              );
            }
            case "image":
              return <img class="w-full" src={props.sourceURL} />;
            default:
              return (
                <RawCodeBlock
                  code={props.raw!}
                  language="text"
                  class="p-2 sm:px-3 md:px-4"
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
