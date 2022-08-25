// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import {
  getModulePath,
  type SourcePageDirEntry,
} from "@/util/registry_utils.ts";
import * as Icons from "./Icons.tsx";

export function DirectoryListing(props: {
  items: SourcePageDirEntry[];
  name: string;
  version: string;
  path: string;
  repositoryURL: string;
  url: URL;
  docable?: boolean;
}) {
  const doc = new URL(props.url);
  doc.searchParams.delete("source");
  if (props.path === "") {
    doc.searchParams.set("doc", "");
  }

  return (
    <div class={tw`border border-gray-200 rounded-lg`}>
      <div
        class={tw`py-3 px-5 flex justify-between items-center`}
      >
        <div class={tw`flex items-center gap-2`}>
          <Icons.Index class="text-gray-500" />
          <span class={tw`text-lg leading-5 font-semibold`}>Directory</span>
        </div>
        <div
          class={tw`flex items-center gap-3 children:(border border-dark-border rounded p-2 hover:bg-ultralight)`}
        >
          <a href={props.repositoryURL} title="Repository URL">
            <Icons.GitHub class="h-4 w-4" />
          </a>
          <a href={doc.href} title="Documentation">
            <Icons.Manual class="h-4" />
          </a>
        </div>
      </div>

      <DirectoryView
        items={props.items}
        path={props.path}
        url={props.url}
        baseURL={getModulePath(props.name, props.version)}
      />
    </div>
  );
}

export function DirectoryView(props: {
  items: SourcePageDirEntry[];
  path: string;
  url: URL;
  baseURL: string;
}) {
  // prioritize dirs and secondarily order by path alphabetically
  props.items.sort((a, b) =>
    ((a.kind === "dir" && b.kind !== "dir")
      ? -1
      : (b.kind === "dir" ? 1 : 0)) || a.path.localeCompare(b.path)
  );

  return (
    <ul>
      {props.items.map((item) => (
        <li class={tw`rounded-md odd:bg-ultralight group`}>
          <a
            href={`${props.baseURL}${item.path}?source`}
            class={tw`py-2.5 px-5 flex justify-between items-center`}
          >
            <span class={tw`flex items-center gap-3`}>
              {item.kind === "file"
                ? <Icons.Source class="text-gray-500" />
                : <Icons.Folder class="text-gray-500" />}
              <span class={tw`link group-hover:text-blue-400`}>
                {item.path.split("/").at(-1)}
              </span>
            </span>
            <span class={tw`text-sm text-gray-400`}>
              {bytesToSize(item.size)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function bytesToSize(bytes: number) {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(0) + " " + sizes[i];
}
