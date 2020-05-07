import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { parseNameVersion, getVersionList } from "../util/registry_utils";
import {
  TableOfContents,
  getTableOfContents,
  getFile,
} from "../util/manual_utils";
import Markdown from "./Markdown";
import Transition from "./Transition";

function Manual() {
  const { query, push } = useRouter();
  const { version, path } = useMemo(() => {
    const path =
      (Array.isArray(query.path) ? query.path.join("/") : query.path) ?? "";
    const [name, version] = parseNameVersion(
      (Array.isArray(query.identifier)
        ? query.identifier[0]
        : query.identifier) ?? ""
    );
    return {
      name,
      version,
      path: path ? `/${path}` : "/introduction",
    };
  }, [query]);

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const [
    tableOfContents,
    setTableOfContents,
  ] = useState<TableOfContents | null>(null);

  const [content, setContent] = useState<string | null>(null);

  const [versions, setVersions] = useState<string[] | null | undefined>();

  useEffect(() => {
    getTableOfContents(version ?? "master")
      .then(setTableOfContents)
      .catch((e) => {
        console.error("Failed to fetch table of contents:", e);
        setTableOfContents(null);
      });
  }, [version]);

  useEffect(() => {
    setContent(null);
    getFile(version ?? "master", path)
      .then(setContent)
      .catch((e) => {
        console.error("Failed to fetch content:", e);
        setContent(
          "# 404 - Not Found\nWhoops, the page does not seem to exist."
        );
      });
  }, [version, path]);

  useEffect(() => {
    setVersions(undefined);
    getVersionList("deno")
      .then(setVersions)
      .catch((e) => {
        console.error("Failed to fetch versions:", e);
        setVersions(null);
      });
  }, []);

  function gotoVersion(newVersion: string) {
    push(
      `/[identifier]${path ? "/[...path]" : ""}`,
      `/manual${newVersion !== "" ? `@${newVersion}` : ""}${path}`
    );
  }

  return (
    <div>
      <Head>
        <title>The Deno Manual</title>
      </Head>
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
                  <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
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
                      className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600"
                      aria-label="Close sidebar"
                      onClick={() => setShowSidebar(false)}
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
                      <a className="block flex items-center flex-shrink-0 px-4">
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
                  {tableOfContents && <ToC tableOfContents={tableOfContents} />}
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
                <a className="block flex items-center flex-shrink-0 px-4">
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
            {tableOfContents && <ToC tableOfContents={tableOfContents} />}
          </div>
        </div>
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <Link href="/">
              <a className="px-4 border-r border-gray-200 flex items-center justify-center md:hidden">
                <img src="/logo.svg" alt="logo" className="w-auto h-10" />
              </a>
            </Link>
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex">
                <div className="w-full flex md:ml-0">
                  <label htmlFor="search_field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
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
                    <input
                      id="search_field"
                      className="block w-full h-full pl-8 pr-3 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              className="px-4 border-l border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600 md:hidden"
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
          >
            <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 pb-12 sm:pb-20">
              {content && <Markdown source={content} />}
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
  versions: string[] | null | undefined;
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
            value={version}
            onChange={({ target: { value: newVersion } }) =>
              gotoVersion(newVersion)
            }
          >
            {versions && version && !versions.includes(version) && (
              <option key={version} value={version}>
                {version}
              </option>
            )}
            <option key="" value="">
              master
            </option>
            {versions &&
              versions.map((v) => (
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

function ToC({ tableOfContents }: { tableOfContents: TableOfContents }) {
  return (
    <div className="pt-2 pb-8 h-0 flex-1 flex flex-col overflow-y-auto">
      <nav className="flex-1 px-2 px-4">
        <ol className="pl-2 list-decimal list-inside font-semibold nested">
          {tableOfContents &&
            Object.entries(tableOfContents).map(([slug, entry]) => {
              return (
                <li key={slug} className="my-2">
                  <Link href="/[identifier]/[...path]" as={`/manual/${slug}`}>
                    <a className="text-gray-900 hover:text-gray-600 font-normal">
                      {entry.name}
                    </a>
                  </Link>
                  {entry.children && (
                    <ol className="pl-4 list-decimal nested">
                      {Object.entries(entry.children).map(
                        ([childSlug, name]) => (
                          <li key={`${slug}/${childSlug}`} className="my-0.5">
                            <Link
                              href="/[identifier]/[...path]"
                              as={`/manual/${slug}/${childSlug}`}
                            >
                              <a className="text-gray-900 hover:text-gray-600 font-normal">
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
