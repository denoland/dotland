// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "@twind";
import { FileDisplay } from "./FileDisplay.tsx";
import { DirectoryListing } from "./DirectoryListing.tsx";
import {
  CodePageDir,
  CodePageFile,
  CommonProps,
} from "@/util/registry_utils.ts";

export function CodeView({
  isStd,
  name,
  version,
  path,
  url,

  repositoryURL,

  data,
}: CommonProps & {
  data: CodePageFile | CodePageDir;
}) {
  return (
    <main
      class={tw`mt-7 mb-16 lg:mt-12 space-y-12 section-x-inset-xl w-full overflow-auto focus:outline-none`}
    >
      {data.kind === "dir"
        ? (
          <>
            <DirectoryListing
              name={name}
              version={version}
              path={path}
              items={data.entries}
              repositoryURL={repositoryURL}
              url={url}
            />
            {data.readme && (
              <FileDisplay
                isStd={isStd}
                version={version}
                raw={data.readme.content}
                canonicalPath={data.readme.canonicalPath}
                sourceURL={data.readme.url}
                repositoryURL={data.readme.repositoryURL}
                url={url}
              />
            )}
          </>
        )
        : (
          data.file instanceof Error
            ? <div>{data.file.message}</div>
            : (
              <FileDisplay
                isStd={isStd}
                version={version}
                raw={data.file.content}
                filetypeOverride={data.file.highlight ? undefined : "text"}
                canonicalPath={data.file.canonicalPath}
                sourceURL={data.file.url}
                repositoryURL={repositoryURL}
                url={url}
              />
            )
        )}
    </main>
  );
}
