// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { FileDisplay } from "./FileDisplay.tsx";
import { DirectoryListing } from "./DirectoryListing.tsx";
import { CommonProps, RawFile } from "@/util/registry_utils.ts";
import { DocPageFile, DocPageIndex } from "@/util/registry_utils.ts";

export function CodeView({
  isStd,
  name,
  version,
  path,
  url,

  repositoryURL,

  data,
}: CommonProps & {
  data: DocPageIndex | DocPageFile;
}) {
  if (data.kind === "index" && data.items.length === 0) {
    // No files
    return (
      <div
        class={tw`rounded-lg overflow-hidden border border-gray-200 bg-white`}
      >
        <DirectoryListing
          name={name}
          version={version}
          path={path}
          items={versionMeta.directoryListing}
          repositoryURL={repositoryURL}
          url={url}
        />
        <div class={tw`w-full p-4 text-gray-400 italic`}>
          {rawFile instanceof Error ? rawFile.message : "No files."}
        </div>
      </div>
    );
  } else {
    return (
      <div class={tw`flex flex-col gap-4 w-full overflow-auto`}>
        {data.kind === "index"
          ? (
            <DirectoryListing
              name={name}
              version={version}
              path={path}
              items={data.items}
              repositoryURL={repositoryURL}
              url={url}
            />
          )
          : (
            <FileDisplay
              isStd={isStd}
              version={version}
              raw={rawFile.content}
              filetypeOverride={rawFile.highlight ? undefined : "text"}
              canonicalPath={rawFile.canonicalPath}
              sourceURL={rawFile.url}
              repositoryURL={repositoryURL}
              baseURL={basePath}
              url={url}
            />
          )}

        {{
          /*readme && (
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
        )*/
        }}
      </div>
    );
  }
}
