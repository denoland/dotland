/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, createRef, useEffect, useMemo, useState } from "../deps.ts";
import {
  DirListing,
  Entry,
  getBasePath,
  isReadme,
} from "../util/registry_utils.ts";

interface DirectoryListingProps {
  dirListing: DirListing[];
  name: string;
  version: string | undefined;
  path: string;
  repositoryURL?: string | null;
  pathname: string;
}

export function DirectoryListing(props: DirectoryListingProps) {
  const isStd = props.pathname.startsWith("/std");
  const children = useMemo((): Entry[] => {
    const children = props.dirListing
      .filter((d) => d.path.startsWith(props.path + "/"))
      .sort((a, b) => a.path.localeCompare(b.path));
    return children.map((d) => {
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
  }, [props.dirListing, props.path]);

  const [query, setQuery] = useState("");

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

  const searchInput = createRef<HTMLInputElement>();

  useEffect(() => {
    function onPress(e: KeyboardEvent) {
      if (
        searchInput.current &&
        searchInput.current !== document.activeElement
      ) {
        if (e.key === "t") {
          e.preventDefault();
          console.log("focus search", searchInput.current);
          searchInput.current.focus();
        }
      }
    }
    window.addEventListener("keypress", onPress);
    return () => window.removeEventListener("keypress", onPress);
  }, [searchInput]);

  const [showHiddenItem, setShowHiddenItem] = useState<boolean>(false);

  return (
    <div className="flex flex-col overflow-x-auto">
      <div className="inline-block min-w-full shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 border-b border-gray-200 py-2 px-4 flex justify-between">
          <div className="flex items-center">
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              className="w-6 h-6 text-gray-400 inline-block mr-2"
            >
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z">
              </path>
            </svg>
            <span className="ml-2 font-medium">{props.path || "/"}</span>
          </div>
          {props.repositoryURL &&
            (
              <a href={props.repositoryURL} className="link ml-4">
                Repository
              </a>
            )}
        </div>
        <div>
          <table className="min-w-full table-fixed w-full">
            <colgroup>
              <col className="w-9 md:w-12" />
              <col className="w-max-content" />
              <col style={{ width: "5.5rem" }} />
            </colgroup>
            <thead>
              <tr className="table-row border-b-2 border-gray-200">
                <td colSpan={3} className="">
                  <div className="flex w-full">
                    <div className="px-2 sm:pl-3 md:pl-4 py-1 text-gray-400">
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        >
                        </path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="w-full pl-3 text-gray-900 text-sm outline-none bg-gray-50"
                      onChange={(e) => setQuery(e.target.value)}
                      value={query}
                      placeholder="Search files..."
                      ref={searchInput}
                    />
                  </div>
                </td>
              </tr>
            </thead>
            <tbody className="bg-white">
              {displayItems.map((entry: Entry, i: number) => {
                const isLastItem = displayItems.length - 1 === i;
                return (
                  <TableRow
                    key={i}
                    entry={entry}
                    href={buildEntryURL(props.path, entry)}
                    isLastItem={isLastItem}
                    isHiddenItem={false}
                    showHiddenItem={showHiddenItem}
                  />
                );
              })}
              {(() => {
                if (hiddenItems.length > 0) {
                  return (
                    <tr
                      className={`
                        bg-gray-50 cursor-pointer hover:bg-gray-100 border-t border-gray-200
                        ${showHiddenItem ? " border-b" : ""}
                      `}
                      onClick={() => setShowHiddenItem(!showHiddenItem)}
                    >
                      <td colSpan={3}>
                        <div className="w-full text-center text-sm px-2 sm:pl-3 md:pl-4 py-1 text-blue-500">
                          {showHiddenItem
                            ? `Close hidden ${
                              hiddenItems.length === 1 ? "item" : "items"
                            }`
                            : `Show hidden ${hiddenItems.length} ${
                              hiddenItems.length === 1 ? "item" : "items"
                            }`}
                        </div>
                      </td>
                    </tr>
                  );
                }
              })()}
              {hiddenItems.map((entry: Entry, i: number) => {
                const isLastItem = hiddenItems.length - 1 === i;
                return (
                  <TableRow
                    key={i}
                    entry={entry}
                    href={buildEntryURL(props.path, entry)}
                    isLastItem={isLastItem}
                    isHiddenItem={true}
                    showHiddenItem={showHiddenItem}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
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
  showHiddenItem: boolean;
}

function TableRow({
  entry,
  href,
  isLastItem,
  isHiddenItem,
  showHiddenItem,
}: TableRowProps) {
  return (
    <tr
      className={`table-row hover:bg-gray-100${
        !isLastItem ? " border-b border-gray-200" : ""
      } ${isHiddenItem && !showHiddenItem ? "hidden" : ""}`}
    >
      <td className="whitespace-no-wrap text-sm leading-5 text-gray-400">
        <a
          href={href}
          className={`px-2 sm:pl-3 md:pl-4 py-1 w-full block ${
            entry.type === "dir" ? "text-blue-300" : "text-gray-300"
          }`}
          tabIndex={-1}
        >
          <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
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
      <td className="whitespace-no-wrap text-sm text-blue-500 leading-5">
        <a href={href} className="pl-2 py-1 w-full block truncate">
          {entry.path && <span className="font-light">{entry.path}/</span>}
          <span className={isReadme(entry.name) || entry.path ? "font-medium" : ""}>
              {entry.name}
            </span>
        </a>
      </td>
      <td className="whitespace-no-wrap text-sm leading-5 text-gray-500 text-right">
        <a href={href} className="px-4 py-1 pl-1 w-full h-full block" tabIndex={-1}>
          {entry.size ? bytesToSize(entry.size) : <>&nbsp;</>}
        </a>
      </td>
    </tr>
  );
}
