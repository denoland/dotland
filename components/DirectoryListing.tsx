// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { runtime, tw } from "../deps.ts";
import {
  DirListing,
  Entry,
  getBasePath,
  isReadme,
} from "../util/registry_utils.ts";

import {
  ModuleIndex,
  type ModuleIndexWithDoc,
} from "doc_components/module_index.tsx";

export function DirectoryListing(props: {
  dirListing: DirListing[];
  name: string;
  version: string | undefined;
  path: string;
  repositoryURL?: string | null;
  url: URL;
  index: ModuleIndexWithDoc;
}) {
  const isStd = props.url.pathname.startsWith("/std");
  const children = props.dirListing
    .filter((d) => d.path.startsWith(props.path + "/"))
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((d) => {
      const parts = d.path.substring(props.path.length + 1).split("/");
      return {
        name: parts[parts.length - 1],
        path: parts.length === 1
          ? undefined
          : parts.slice(0, parts.length - 1).join("/"),
        size: d.size,
        type: d.type,
      };
    });

  const query = props.url.searchParams.get("query") ?? "";

  const display = query.length > 1
    ? children.filter(
      (d: Entry) =>
        (d.path?.toLowerCase().includes(query.toLowerCase()) ||
          d.name.toLowerCase().includes(query.toLowerCase())) &&
        d.type === "file",
    )
    : children.filter((d: Entry) => d.path === undefined);
  const displayItems = query.length > 0 ? display : display
    .filter((d: Entry): boolean => !d.name.match(/^\..*$/))
    .sort((a: Entry, b: Entry) => a.type.localeCompare(b.type));
  const hiddenItems = query.length > 0 ? [] : display
    .filter((d: Entry) => !!d.name.match(/^\..*$/))
    .sort((a: Entry, b: Entry) => a.type.localeCompare(b.type));
  const baseURL = getBasePath({
    isStd: isStd,
    name: props.name,
    version: props.version,
  });
  const buildEntryURL = (path: string, entry: Entry): string => {
    return `${baseURL}${path}/${
      entry.path ? entry.path + "/" : ""
    }${entry.name}`;
  };

  const dirview = props.url.searchParams.has("dirview");
  const searchDoc = new URL(props.url);
  searchDoc.searchParams.delete("dirview");
  const searchDir = new URL(props.url);
  searchDir.searchParams.set("dirview", "");

  return (
    <div class={tw`flex flex-col overflow-x-auto`}>
      <div
        class={tw
          `inline-block min-w-full shadow-sm rounded-lg border border-gray-200 overflow-hidden`}
      >
        <div
          class={tw
            `bg-gray-100 border-b border-gray-200 py-2 flex justify-between pl-4 pr-2`}
        >
          <div class={tw`flex items-center`}>
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              class={tw`w-6 h-6 text-gray-400 inline-block mr-2`}
            >
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z">
              </path>
            </svg>
            <span class={tw`ml-2 font-medium`}>{props.path || "/"}</span>
          </div>
          <div class={tw`inline-flex items-center`}>
            <div>
              {props.repositoryURL &&
                (
                  <a href={props.repositoryURL} class={tw`link ml-4`}>
                    Repository
                  </a>
                )}
            </div>
            <div
              class={tw`inline-block ml-4 inline-flex shadow-sm rounded-md`}
            >
              <a
                href={searchDoc.href}
                class={tw
                  `relative inline-flex items-center px-1.5 py-1.5 rounded-l-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    !dirview ? "bg-white" : "bg-gray-100"
                  }`}
              >
                <span class={tw`sr-only`}>Documentation</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </a>
              <a
                href={searchDir.href}
                class={tw
                  `-ml-px relative inline-flex items-center px-1.5 py-1.5 rounded-r-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    dirview ? "bg-white" : "bg-gray-100"
                  }`}
              >
                <span class={tw`sr-only`}>Directory Listing</span>
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
          </div>
        </div>

        {dirview
          ? (
            <div>
              <input
                type="checkbox"
                class={tw`hidden`}
                id="hiddenItemsToggle"
                autoComplete="off"
              />
              <table class={tw`min-w-full table-fixed w-full`}>
                <colgroup>
                  <col class={tw`w-9 md:w-12`} />
                  <col class={tw`w-max-content`} />
                  <col style={{ width: "5.5rem" }} />
                </colgroup>
                <tbody class={tw`bg-white`}>
                  {displayItems.map((entry: Entry, i: number) => {
                    const isLastItem = displayItems.length - 1 === i;
                    return (
                      <TableRow
                        key={i}
                        entry={entry}
                        href={buildEntryURL(props.path, entry)}
                        isLastItem={isLastItem}
                        isHiddenItem={false}
                      />
                    );
                  })}
                  {hiddenItems.length > 0 &&
                    (
                      <tr
                        id="hiddenItemsTr"
                        class={tw
                          `bg-gray-50 cursor-pointer hover:bg-gray-100 border-t border-gray-200`}
                      >
                        <td colSpan={3}>
                          <label htmlFor="hiddenItemsToggle">
                            <div
                              id="hiddenItemsButton"
                              class={tw
                                `select-none w-full text-center text-sm px-2 sm:pl-3 md:pl-4 py-1 text-blue-500`}
                            >
                              <span>
                                {`Close hidden ${
                                  hiddenItems.length === 1 ? "item" : "items"
                                }`}
                              </span>
                              <span>
                                {`Show hidden ${hiddenItems.length} ${
                                  hiddenItems.length === 1 ? "item" : "items"
                                }`}
                              </span>
                            </div>
                          </label>
                        </td>
                      </tr>
                    )}
                  {hiddenItems.map((entry: Entry, i: number) => {
                    const isLastItem = hiddenItems.length - 1 === i;
                    return (
                      <TableRow
                        key={i}
                        entry={entry}
                        href={buildEntryURL(props.path, entry)}
                        isLastItem={isLastItem}
                        isHiddenItem={true}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
          : (
            <div class={tw`bg-white dark:(bg-gray-900 text-white)`}>
              <ModuleIndex base={baseURL} path={props.path || "/"}>
                {props.index}
              </ModuleIndex>
            </div>
          )}
      </div>
    </div>
  );
}

function bytesToSize(bytes: number) {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(0) + " " + sizes[i];
}

interface TableRowProps {
  key: number;
  entry: Entry;
  href: string;
  isLastItem: boolean;
  isHiddenItem: boolean;
}

function TableRow({
  entry,
  href,
  isLastItem,
  isHiddenItem,
}: TableRowProps) {
  return (
    <tr
      class={tw`table-row hover:bg-gray-100${
        !isLastItem ? " border-b border-gray-200" : ""
      }`}
      name={isHiddenItem ? "hidden" : ""}
    >
      <td class={tw`whitespace-no-wrap text-sm leading-5 text-gray-400`}>
        <a
          href={href}
          class={tw`px-2 sm:pl-3 md:pl-4 py-1 w-full block ${
            entry.type === "dir" ? "text-blue-300" : "text-gray-300"
          }`}
          tabIndex={-1}
        >
          <svg fill="currentColor" viewBox="0 0 20 20" class={tw`w-5 h-5`}>
            {(() => {
              switch (entry.type) {
                case "file":
                  if (isReadme(entry.name)) {
                    return (
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z">
                      </path>
                    );
                  }
                  return (
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    >
                    </path>
                  );
                case "dir":
                  return (
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z">
                    </path>
                  );
              }
            })()}
          </svg>
        </a>
      </td>
      <td class={tw`whitespace-no-wrap text-sm text-blue-500 leading-5`}>
        <a href={href} class={tw`pl-2 py-1 w-full block truncate`}>
          {entry.path && <span class={tw`font-light`}>{entry.path}/</span>}
          <span
            class={isReadme(entry.name) || entry.path ? "font-medium" : ""}
          >
            {entry.name}
          </span>
        </a>
      </td>
      <td
        class={tw
          `whitespace-no-wrap text-sm leading-5 text-gray-500 text-right`}
      >
        <a
          href={href}
          class={tw`px-4 py-1 pl-1 w-full h-full block`}
          tabIndex={-1}
        >
          {entry.size && bytesToSize(entry.size)}
        </a>
      </td>
    </tr>
  );
}
