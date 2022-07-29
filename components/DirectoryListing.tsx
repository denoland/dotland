// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import {
  type DirListing,
  type Entry,
  getBasePath,
  isReadme,
} from "@/util/registry_utils.ts";
import * as Icons from "./Icons.tsx";

export function DirectoryListing(props: {
  dirListing: DirListing[];
  name: string;
  version: string | undefined;
  path: string;
  repositoryURL?: string | null;
  url: URL;
}) {
  const isStd = props.url.pathname.startsWith("/std");
  const basePath = getBasePath({
    isStd,
    name: props.name,
    version: props.version,
  });

  let doc = new URL(props.url);
  doc.searchParams.delete("code");
  if (!isStd) {
    doc = new URL("https://doc.deno.land/" + doc.href);
  }

  return (
    <div class={tw`flex flex-col overflow-x-auto`}>
      <div
        class={tw`inline-block min-w-full shadow-sm rounded-lg border border-gray-200 overflow-hidden`}
      >
        <div
          class={tw`bg-gray-100 border-b border-gray-200 flex justify-between px-4 py-2`}
        >
          <div class={tw`flex items-center`}>
            <Icons.Folder />
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
            <div class={tw`ml-4`}>
              <a href={doc.href} class={tw`link`}>Documentation</a>
            </div>
          </div>
        </div>

        <DirectoryView
          dirListing={props.dirListing}
          path={props.path}
          url={props.url}
          baseURL={basePath}
        />
      </div>
    </div>
  );
}

export function DirectoryView(props: {
  dirListing: DirListing[];
  path: string;
  url: URL;
  baseURL: string;
}) {
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
  const buildEntryURL = (path: string, entry: Entry): string => {
    return `${props.baseURL}${path}/${
      entry.path ? entry.path + "/" : ""
    }${entry.name}?code`;
  };

  return (
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
          <col class={tw`max-w-max`} />
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
                class={tw`bg-gray-50 cursor-pointer hover:bg-gray-100 border-t border-gray-200`}
              >
                <td colSpan={3}>
                  <label htmlFor="hiddenItemsToggle">
                    <div
                      id="hiddenItemsButton"
                      class={tw`select-none w-full text-center text-sm px-2 sm:pl-3 md:pl-4 py-1 text-blue-500`}
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
          {(() => {
            switch (entry.type) {
              case "file":
                if (isReadme(entry.name)) {
                  return <Icons.OpenBook />;
                }
                return <Icons.Page />;
              case "dir":
                return <Icons.Folder />;
            }
          })()}
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
        class={tw`whitespace-no-wrap text-sm leading-5 text-gray-500 text-right`}
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
