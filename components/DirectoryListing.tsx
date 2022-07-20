// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { getBasePath, isReadme } from "@/util/registry_utils.ts";
import * as Icons from "./Icons.tsx";
import { IndexItem } from "../util/registry_utils.ts";

export function DirectoryListing(props: {
  items: IndexItem[];
  name: string;
  version: string;
  path: string;
  repositoryURL: string;
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
        class={tw
          `inline-block min-w-full shadow-sm rounded-lg border border-gray-200 overflow-hidden`}
      >
        <div
          class={tw
            `bg-gray-100 border-b border-gray-200 flex justify-between px-4 py-2`}
        >
          <div class={tw`flex items-center`}>
            <Icons.Folder />
            <span class={tw`ml-2 font-medium`}>{props.path || "/"}</span>
          </div>
          <div class={tw`inline-flex items-center`}>
            <a href={props.repositoryURL} class={tw`link ml-4`}>
              Repository
            </a>
            <div class={tw`ml-4`}>
              <a href={doc.href} class={tw`link`}>Documentation</a>
            </div>
          </div>
        </div>

        <DirectoryView
          items={props.items}
          path={props.path}
          url={props.url}
          baseURL={basePath}
        />
      </div>
    </div>
  );
}

const HIDDEN_REGEX = /^\/\..*$/;

export function DirectoryView(props: {
  items: IndexItem[];
  path: string;
  url: URL;
  baseURL: string;
}) {
  const show: IndexItem[] = [];
  const hidden: IndexItem[] = [];

  // prioritize dirs and ignore order of other kinds,
  // and secondarily order by path alphabetically
  props.items.sort((a, b) =>
    ((a.kind === "dir" && b.kind !== "dir")
      ? -1
      : (b.kind === "dir" ? 1 : 0)) || a.path.localeCompare(b.path)
  );

  for (const item of props.items) {
    if (HIDDEN_REGEX.test(item.path)) {
      hidden.push(item);
    } else {
      show.push(item);
    }
  }

  const buildEntryURL = (path: string, item: IndexItem): string => {
    return `${props.baseURL}${item.path}?code`;
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
          <col class={tw`w-max-content`} />
          <col style={{ width: "5.5rem" }} />
        </colgroup>
        <tbody class={tw`bg-white`}>
          {show.map((item, i) => (
            <TableRow
              key={i}
              item={item}
              href={buildEntryURL(props.path, item)}
              isLastItem={show.length - 1 === i}
            />
          ))}
          {hidden.length > 0 &&
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
                          hidden.length === 1 ? "item" : "items"
                        }`}
                      </span>
                      <span>
                        {`Show hidden ${hidden.length} ${
                          hidden.length === 1 ? "item" : "items"
                        }`}
                      </span>
                    </div>
                  </label>
                </td>
              </tr>
            )}
          {hidden.map((item, i) => (
            <TableRow
              key={i}
              item={item}
              href={buildEntryURL(props.path, item)}
              isLastItem={hidden.length - 1 === i}
              isHidden
            />
          ))}
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

function TableRow({
  item,
  href,
  isLastItem,
  isHidden,
}: {
  item: IndexItem;
  key: number;
  href: string;
  isLastItem: boolean;
  isHidden?: boolean;
}) {
  const display = item.path.split("/").at(-1)!;
  return (
    <tr
      class={tw`table-row hover:bg-gray-100${
        !isLastItem ? " border-b border-gray-200" : ""
      }`}
      name={isHidden ? "hidden" : ""}
    >
      <td class={tw`whitespace-no-wrap text-sm leading-5 text-gray-400`}>
        <a
          href={href}
          class={tw`px-2 sm:pl-3 md:pl-4 py-1 w-full block ${
            item.kind === "dir" ? "text-blue-300" : "text-gray-300"
          }`}
          tabIndex={-1}
        >
          {(() => {
            switch (item.kind) {
              case "module":
              case "file":
                if (isReadme(display)) {
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
          {display}
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
          {bytesToSize(item.size)}
        </a>
      </td>
    </tr>
  );
}
