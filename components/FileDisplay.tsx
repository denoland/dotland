/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import { RawCodeBlock } from "./CodeBlock";
import Markdown from "./Markdown";
import Link from "next/link";
import {
  fileTypeFromURL,
  isReadme,
  fileNameFromURL,
} from "../util/registry_utils";
import { useRouter } from "next/router";

function FileDisplay(props: {
  raw?: string;
  canonicalPath: string;
  sourceURL: string;
  baseURL: string;
  repositoryURL?: string | null;
  documentationURL?: string | null;
  stdVersion?: string;
}): React.ReactElement {
  const { pathname } = useRouter();
  const filetype = fileTypeFromURL(props.sourceURL);
  const filename = fileNameFromURL(props.sourceURL);

  return (
    <div className="shadow-sm rounded-lg border border-gray-200 overflow-hidden bg-white">
      <div className="bg-gray-100 border-b border-gray-200 py-2 px-4 flex justify-between">
        <div className="flex items-center">
          {isReadme(filename) && (
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              className="w-6 h-6 text-gray-400 inline-block mr-2"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
            </svg>
          )}
          <span className="font-medium">
            {props.canonicalPath === pathname ? (
              filename
            ) : (
              <Link href={props.canonicalPath}>
                <a className="link">{filename}</a>
              </Link>
            )}
          </span>
        </div>
        <div>
          {props.sourceURL && (
            <a href={props.sourceURL} className="link ml-4">
              Raw
            </a>
          )}
          {props.repositoryURL && (
            <a href={props.repositoryURL} className="link ml-4">
              Repository
            </a>
          )}
        </div>
      </div>
      {props.documentationURL && (
        <a
          href={props.documentationURL}
          className="bg-gray-100 border-b border-gray-200 py-1 px-4 flex align-middle justify-between link group"
        >
          <span>
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              className="w-6 h-6 text-gray-400 inline-block mr-2 group-hover:text-blue-300 transition duration-100 ease-in-out"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
            </svg>
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
                className="p-2 sm:px-3 md:px-4"
              />
            );
          case "html":
            return (
              <RawCodeBlock
                code={props.raw!}
                language="markdown"
                enableLineRef={true}
                className="p-2 sm:px-3 md:px-4"
              />
            );
          case "markdown":
            return (
              <div className="px-4">
                <Markdown
                  source={
                    props.stdVersion === undefined
                      ? props.raw!
                      : props.raw!.replace(
                          /\$STD_VERSION/g,
                          props.stdVersion ?? ""
                        )
                  }
                  displayURL={"https://deno.land" + props.canonicalPath}
                  sourceURL={props.sourceURL}
                  baseURL={"https://deno.land" + props.baseURL}
                />
              </div>
            );
          case "image":
            return <img className="w-full" src={props.sourceURL} />;
          default:
            return (
              <RawCodeBlock
                code={props.raw!}
                language="text"
                enableLineRef={true}
                className="p-2 sm:px-3 md:px-4"
              />
            );
        }
      })()}
    </div>
  );
}

export default FileDisplay;
