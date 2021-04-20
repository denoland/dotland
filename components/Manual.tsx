/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import Head from "next/head";
import Link from "next/link";
import { useRouter, Router } from "next/router";
// @ts-expect-error because @docsearch/react does not have types
import { DocSearchModal, useDocSearchKeyboardEvents } from "@docsearch/react";
import versionMeta from "../versions.json";
import { parseNameVersion } from "../util/registry_utils";
import {
  TableOfContents,
  getTableOfContents,
  getFileURL,
  getDocURL,
  versions,
} from "../util/manual_utils";
import Markdown from "./Markdown";
import Transition from "./Transition";
import { CookieBanner } from "./CookieBanner";
import InlineCode from "./InlineCode";

function Hit({
  hit,
  children,
}: {
  hit: { url: string };
  children: React.ReactElement;
}) {
  return (
    <Link href={hit.url}>
      <a className="link">{children}</a>
    </Link>
  );
}

function Manual(): React.ReactElement {
  const { query, push, replace } = useRouter();
  const { version, path } = useMemo(() => {
    const [identifier, ...pathParts] = (query.rest as string[]) ?? [];
    const path = pathParts.length === 0 ? "" : `/${pathParts.join("/")}`;
    const version = parseNameVersion(identifier ?? "")[1] || versionMeta.cli[0];
    return { version, path: path || "/introduction" };
  }, [query]);

  if (path.endsWith(".md")) {
    replace(
      `/[...rest]`,
      `/manual${version && version !== "" ? `@${version}` : ""}${path.replace(
        /\.md$/,
        ""
      )}`
    );
    return <></>;
  }

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const hideSidebar = () => setShowSidebar(false);

  const manualEl = useRef<HTMLElement>(null);

  const handleRouteChange = (url: string) => {
    manualEl.current?.scrollTo(0, 0);
    setPageIndex(pageList.findIndex((page) => page.path === url));
  };

  useEffect(() => {
    Router.events.on("routeChangeStart", hideSidebar);
    Router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      Router.events.off("routeChangeStart", hideSidebar);
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  const scrollTOCIntoView = () =>
    document.getElementsByClassName("toc-active")[0]?.scrollIntoView();

  useEffect(() => {
    if (showSidebar) {
      scrollTOCIntoView();
    }
  }, [showSidebar]);

  const [
    tableOfContents,
    setTableOfContents,
  ] = useState<TableOfContents | null>(null);

  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    getTableOfContents(version ?? versions[0])
      .then(setTableOfContents)
      .then(scrollTOCIntoView)
      .catch((e) => {
        console.error("Failed to fetch table of contents:", e);
        setTableOfContents(null);
      });
  }, [version]);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageList, setPageList] = useState<
    Array<{ path: string; name: string }>
  >([]);

  useEffect(() => {
    if (tableOfContents) {
      const tempList: Array<{ path: string; name: string }> = [];

      Object.entries(tableOfContents).forEach(([slug, entry]) => {
        tempList.push({ path: `/manual/${slug}`, name: entry.name });

        if (entry.children) {
          Object.entries(entry.children).map(([childSlug, name]) =>
            tempList.push({ path: `/manual/${slug}/${childSlug}`, name })
          );
        }
      });

      setPageList(tempList);
      setPageIndex(
        tempList.findIndex((page) => page.path === `/manual${path}`)
      );
    }
  }, [tableOfContents, path]);

  const sourceURL = useMemo(() => getFileURL(version ?? versions[0], path), [
    version,
    path,
  ]);

  useEffect(() => {
    setContent(null);
    fetch(sourceURL)
      .then((res) => {
        if (res.status !== 200) {
          throw Error(
            `Got an error (${res.status}) while getting the documentation file.`
          );
        }
        return res.text();
      })
      .then(setContent)
      .catch((e) => {
        console.error("Failed to fetch content:", e);
        setContent(
          "# 404 - Not Found\nWhoops, the page does not seem to exist."
        );
      });
  }, [sourceURL]);

  // SEARCH

  const [isOpen, setIsOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>();
  const [initialQuery, setInitialQuery] = useState(null);

  const onOpen = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => {
      document.getElementById("docsearch-input")?.focus();
    }, 0);
  }, [setIsOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onInput = useCallback(
    (e) => {
      setIsOpen(true);
      setInitialQuery(e.key);
    },
    [setIsOpen, setInitialQuery]
  );

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  });

  useEffect(() => {
    function onPress(e: KeyboardEvent) {
      if (!isOpen) {
        if (e.key === "/" || e.key === "s") {
          e.preventDefault();
          onOpen();
        }
      }
    }
    window.addEventListener("keypress", onPress);
    return () => window.removeEventListener("keypress", onPress);
  }, [isOpen, onOpen]);

  function gotoVersion(newVersion: string) {
    push(
      `/[...rest]`,
      `/manual${newVersion !== "" ? `@${newVersion}` : ""}${path}`
    );
  }

  const stdVersion =
    version === undefined
      ? versionMeta.std[0]
      : ((versionMeta.cli_to_std as any)[version ?? ""] as string) ??
        versionMeta.std[0];

  return (
    <div>
      <Head>
        <title>Manual | Deno</title>
        <link
          rel="preconnect"
          href="https://BH4D9OD16A-dsn.algolia.net"
          crossOrigin="true"
        />
      </Head>
      {isOpen &&
        createPortal(
          <DocSearchModal
            initialQuery={initialQuery}
            initialScrollY={window.scrollY}
            searchParameters={{
              distinct: 1,
            }}
            onClose={onClose}
            indexName="deno_manual"
            apiKey="a05e65bb082b87ff0ae75506f1b29fce"
            navigator={{
              navigate({ suggestionUrl }: any) {
                push("/[...rest]", suggestionUrl);
              },
            }}
            hitComponent={Hit}
            transformItems={(items: Array<{ url: string }>) => {
              return items.map((item) => {
                // We transform the absolute URL into a relative URL to
                // leverage Next's preloading.
                const a = document.createElement("a");
                a.href = item.url;

                return {
                  ...item,
                  url: `${a.pathname}${a.hash}`,
                };
              });
            }}
          />,
          document.body
        )}

      <div className="h-screen flex overflow-hidden">
        <Transition show={showSidebar}>
          <div className="md:hidden">
            <div className="fixed inset-0 flex z-40">
              <Transition
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0">
                  <div
                    className="absolute inset-0 bg-gray-600 opacity-75"
                    onClick={hideSidebar}
                  ></div>
                </div>
              </Transition>
              <Transition
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                  <div className="absolute top-0 right-0 -mr-14 p-1">
                    <button
                      role="button"
                      className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600"
                      aria-label="Close sidebar"
                      onClick={hideSidebar}
                    >
                      <svg
                        className="h-6 w-6 text-white"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-gray-100 pb-4 pt-4 border-b border-gray-200">
                    <Link href="/">
                      <a className="flex items-center flex-shrink-0 px-4">
                        <img
                          src="/logo.svg"
                          alt="logo"
                          className="w-auto h-12"
                        />
                        <div className="mx-4 flex flex-col justify-center">
                          <div className="font-bold text-gray-900 leading-6 text-2xl tracking-tight">
                            Deno Manual
                          </div>
                        </div>
                      </a>
                    </Link>
                    <Version
                      version={version}
                      versions={versions}
                      gotoVersion={gotoVersion}
                    />
                  </div>
                  {tableOfContents && (
                    <ToC
                      tableOfContents={tableOfContents}
                      version={version}
                      path={path}
                    />
                  )}
                </div>
              </Transition>
              <div className="flex-shrink-0 w-14">
                {/*<!-- Dummy element to force sidebar to shrink to fit close icon -->*/}
              </div>
            </div>
          </div>
        </Transition>

        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-72 border-r border-gray-200 bg-gray-50">
            <div className="bg-gray-100 pb-4 pt-4 border-b border-gray-200">
              <Link href="/">
                <a className="flex items-center flex-shrink-0 px-4">
                  <img src="/logo.svg" alt="logo" className="w-auto h-12" />
                  <div className="mx-4 flex flex-col justify-center">
                    <div className="font-bold text-gray-900 leading-6 text-2xl tracking-tight">
                      Deno Manual
                    </div>
                  </div>
                </a>
              </Link>
              <Version
                version={version}
                versions={versions}
                gotoVersion={gotoVersion}
              />
            </div>
            {tableOfContents && (
              <ToC
                tableOfContents={tableOfContents}
                version={version}
                path={path}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <div className="z-10 flex-shrink-0 flex h-16 bg-white shadow md:hidden">
            <Link href="/">
              <a className="px-4 flex items-center justify-center md:hidden">
                <img src="/logo.svg" alt="logo" className="w-auto h-10" />
              </a>
            </Link>
            <div className="border-l border-r border-gray-200 flex-1 px-4 flex justify-between">
              <div className="flex-1 flex">
                <div className="w-full flex justify-between h-full">
                  <label htmlFor="search_field" className="sr-only">
                    Search
                  </label>
                  <button
                    className="w-full text-gray-400 focus-within:text-gray-600 flex items-center"
                    onClick={onOpen}
                  >
                    <div className="flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        />
                      </svg>
                    </div>
                    <div className="pl-6">
                      <span className="inline sm:hidden">Search docs</span>
                      <span className="hidden sm:inline">
                        Search the docs (press <InlineCode>/</InlineCode> to
                        focus)
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <button
              className="px-4 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600 md:hidden"
              aria-label="Open sidebar"
              onClick={() => setShowSidebar(true)}
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </button>
          </div>

          <main
            className="flex-1 relative z-0 overflow-y-auto focus:outline-none"
            tabIndex={0}
            ref={manualEl}
          >
            <div className="h-16 bg-white shadow hidden md:block">
              <div className="max-w-screen-md mx-auto px-12 w-full flex justify-between h-full">
                <label htmlFor="search_field" className="sr-only">
                  Search
                </label>
                <button
                  className="w-full text-gray-400 focus-within:text-gray-600 flex items-center"
                  onClick={onOpen}
                  ref={searchButtonRef as any}
                >
                  <div className="flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      />
                    </svg>
                  </div>
                  <div className="pl-6">
                    Search the docs (press <InlineCode>/</InlineCode> to focus)
                  </div>
                </button>
              </div>
            </div>
            <CookieBanner />
            <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 pb-12 sm:pb-20">
              {content ? (
                <>
                  <a
                    href={getDocURL(version ?? versions[0], path)}
                    className={`text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out float-right ${
                      path.split("/").length === 2 ? "mt-11" : "mt-9"
                    } mr-4`}
                  >
                    <span className="sr-only">GitHub</span>
                    <svg
                      className="h-6 w-6 inline"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>Edit on GitHub</title>
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <Markdown
                    source={content
                      .replace(/\$STD_VERSION/g, stdVersion)
                      .replace(/\$CLI_VERSION/g, version)}
                    displayURL={`https://deno.land/manual${
                      version ? `@${version}` : ""
                    }${path}`}
                    sourceURL={sourceURL}
                    baseURL={`https://deno.land/manual${
                      version ? `@${version}` : ""
                    }`}
                  />
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {pageList[pageIndex - 1] !== undefined && (
                      <Link href={pageList[pageIndex - 1].path}>
                        <a className="text-gray-900 hover:text-gray-600 font-normal">
                          ← {pageList[pageIndex - 1].name}
                        </a>
                      </Link>
                    )}
                    {pageList[pageIndex + 1] !== undefined && (
                      <Link href={pageList[pageIndex + 1].path}>
                        <a className="text-gray-900 hover:text-gray-600 font-normal float-right">
                          {pageList[pageIndex + 1].name} →
                        </a>
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full my-8">
                  <div className="w-4/5 sm:w-1/3 bg-gray-100 h-8"></div>
                  <div className="sm:w-2/3 bg-gray-100 h-3 mt-10"></div>
                  <div className="w-5/6 sm:w-3/4 bg-gray-100 h-3 mt-4"></div>
                  <div className="sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-3/4 bg-gray-100 h-3 mt-4"></div>
                  <div className="sm:w-2/3 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-2/4 sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                  <div className="sm:w-2/3 bg-gray-100 h-3 mt-10"></div>
                  <div className="sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-5/6 sm:w-3/4 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-3/4 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-2/4 sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                  <div className="sm:w-2/3 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-3/4 bg-gray-100 h-3 mt-10"></div>
                  <div className="sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                  <div className="sm:w-2/3 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-5/6 sm:w-3/4 bg-gray-100 h-3 mt-4"></div>
                  <div className="w-2/4 sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                  <div className="sm:w-2/3 bg-gray-100 h-3 mt-4"></div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function Version({
  version,
  versions,
  gotoVersion,
}: {
  version: string | undefined;
  versions: string[];
  gotoVersion: (version: string) => void;
}) {
  return (
    <div className="mt-5 px-4">
      <label htmlFor="version" className="sr-only">
        Version
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <div className="max-w-xs rounded-md shadow-sm">
          <select
            id="version"
            className="block form-select w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            value={version ?? versions[0]}
            onChange={({ target: { value: newVersion } }) =>
              gotoVersion(newVersion)
            }
          >
            {version && version !== "main" && !versions.includes(version) && (
              <option key={version} value={version}>
                {version}
              </option>
            )}
            <option key="main" value="main">
              main
            </option>
            {versions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function ToC({
  tableOfContents,
  version,
  path,
}: {
  tableOfContents: TableOfContents;
  version: string | undefined;
  path: string;
}) {
  return (
    <div className="pt-2 pb-8 h-0 flex-1 flex flex-col overflow-y-auto">
      <nav className="flex-1 px-4">
        <ol className="list-decimal list-inside font-semibold nested">
          {tableOfContents &&
            Object.entries(tableOfContents).map(([slug, entry]) => {
              return (
                <li key={slug} className="my-2">
                  <Link href={`/manual${version ? `@${version}` : ""}/${slug}`}>
                    <a
                      className={`${
                        path === `/${slug}`
                          ? "text-blue-600 hover:text-blue-500 toc-active"
                          : "text-gray-900 hover:text-gray-600"
                      } font-bold`}
                    >
                      {entry.name}
                    </a>
                  </Link>
                  {entry.children && (
                    <ol className="pl-4 list-decimal nested">
                      {Object.entries(entry.children).map(
                        ([childSlug, name]) => (
                          <li key={`${slug}/${childSlug}`} className="my-0.5">
                            <Link
                              href={`/manual${
                                version ? `@${version}` : ""
                              }/${slug}/${childSlug}`}
                            >
                              <a
                                className={`${
                                  path === `/${slug}/${childSlug}`
                                    ? "text-blue-600 hover:text-blue-500 toc-active"
                                    : "text-gray-900 hover:text-gray-600"
                                } font-normal`}
                              >
                                {name}
                              </a>
                            </Link>
                          </li>
                        )
                      )}
                    </ol>
                  )}
                </li>
              );
            })}
        </ol>
      </nav>
    </div>
  );
}

export default Manual;
