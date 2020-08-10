/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import {
  parseNameVersion,
  denoDocAvailableForURL,
  isReadme,
  getSourceURL,
  getRepositoryURL,
  DirEntry,
  getVersionMeta,
  getVersionList,
  VersionInfo,
  VersionMetaInfo,
  findRootReadme,
} from "../util/registry_utils";
import Header from "./Header";
import Footer from "./Footer";
import FileDisplay from "./FileDisplay";
import DirectoryListing from "./DirectoryListing";
import { CookieBanner } from "./CookieBanner";

const Registry = () => {
  // State
  const [versions, setVersions] = useState<VersionInfo | null | undefined>();
  const [versionMeta, setVersionMeta] = useState<
    VersionMetaInfo | null | undefined
  >();
  const [raw, setRaw] = useState<string | null | undefined>();
  const [readme, setReadme] = useState<string | null | undefined>();

  // Name, version and path
  const { query, asPath, push, replace } = useRouter();
  const isStd = asPath.startsWith("/std");
  const { name, version, path } = useMemo(() => {
    const [identifier, ...pathParts] = (query.rest as string[]) ?? [];
    const path = pathParts.length === 0 ? "" : `/${pathParts.join("/")}`;
    const [name, version] = parseNameVersion(identifier ?? "");
    return { name, version, path };
  }, [query]);
  function gotoVersion(newVersion: string, doReplace?: boolean) {
    const href = `${!isStd ? "/x" : ""}/[...rest]`;
    const asPath = `${!isStd ? "/x" : ""}/${
      name + (newVersion !== "" ? `@${newVersion}` : "")
    }${path}`;
    if (doReplace) {
      replace(href, asPath);
    } else {
      push(href, asPath);
    }
  }

  // File paths
  const canonicalPath = useMemo(
    () => `${isStd ? "" : "/x"}/${name}${version ? `@${version}` : ""}${path}`,
    [name, version, path]
  );
  const sourceURL = useMemo(() => getSourceURL(name, version, path), [
    name,
    version,
    path,
  ]);
  const repositoryURL = useMemo(
    () => (versionMeta ? getRepositoryURL(versionMeta, path) : undefined),
    [versionMeta, path]
  );
  const documentationURL = useMemo(() => {
    const doc = `https://doc.deno.land/https/deno.land/${canonicalPath}`;
    return denoDocAvailableForURL(canonicalPath) ? doc : null;
  }, [canonicalPath]);

  // Fetch versions
  useEffect(() => {
    setVersions(undefined);
    if (name) {
      getVersionList(name)
        .then(setVersions)
        .catch((e) => {
          console.error("Failed to fetch versions:", e);
          setVersions(null);
        });
    }
  }, [name]);

  // If no version is specified, redirect to latest version
  useEffect(() => {
    if (!version && versions && versions.latest !== null) {
      gotoVersion(versions.latest ?? "", true);
    }
  }, [versions?.latest, version]);

  // If std version starts with v, redirect to version without v
  useEffect(() => {
    if (version && version.startsWith("v") && name === "std") {
      gotoVersion(version.substring(1), true);
    }
  }, [name, version]);

  // Fetch version meta data
  useEffect(() => {
    setVersionMeta(undefined);
    if (version) {
      if (name) {
        getVersionMeta(name, version)
          .then(setVersionMeta)
          .catch((e) => {
            console.error("Failed to fetch dir entry:", e);
            setVersionMeta(null);
          });
      } else {
        setVersionMeta(null);
      }
    }
  }, [name, version]);

  // Get directory entries for path
  const dirEntries = useMemo(() => {
    if (versionMeta) {
      const files = versionMeta.directoryListing
        .filter(
          (f) =>
            f.path.startsWith(path + "/") &&
            f.path.split("/").length - 2 === path.split("/").length - 1
        )
        .map<DirEntry>((f) => {
          const [name] = f.path.slice(path.length + 1).split("/");
          return {
            name,
            size: f.size,
            type: f.type,
          };
        });
      files.sort((a, b) => a.name.codePointAt(0)! - b.name.codePointAt(0)!);
      return files.length === 0 ? null : files;
    }
    return versionMeta;
  }, [versionMeta, path]);

  const {
    readmeCanonicalPath,
    readmeURL,
    readmeRepositoryURL,
  } = useMemo(() => {
    const readmeEntry =
      path === ""
        ? findRootReadme(versionMeta?.directoryListing)
        : dirEntries?.find((d) => isReadme(d.name));
    if (readmeEntry) {
      return {
        readmeCanonicalPath: canonicalPath + "/" + readmeEntry.name,
        readmeURL: getSourceURL(name, version, path + "/" + readmeEntry.name),
        readmeRepositoryURL: versionMeta
          ? getRepositoryURL(versionMeta, path + "/" + readmeEntry.name)
          : null,
      };
    }
    return {
      readmeCanonicalPath: null,
      readmeURL: null,
      readmeRepositoryURL: null,
    };
  }, [dirEntries, name, version, path, versionMeta]);

  // Fetch raw file
  useEffect(() => {
    setRaw(undefined);
    if (version) {
      if (
        sourceURL &&
        versionMeta &&
        versionMeta.directoryListing.filter(
          (d) => d.path === path && d.type == "file"
        ).length !== 0
      ) {
        fetch(sourceURL, { method: "GET" })
          .then((resp) => {
            if (!resp.ok) {
              if (
                resp.status === 400 ||
                resp.status === 403 ||
                resp.status === 404
              )
                return null;
              throw new Error(`${resp.status}: ${resp.statusText}`);
            }
            return resp.text();
          })
          .then(setRaw)
          .catch(() => setRaw(null));
      } else {
        setRaw(null);
      }
    }
  }, [sourceURL, versionMeta, version, path]);

  // Fetch readme file
  useEffect(() => {
    setReadme(undefined);
    if (version) {
      if (readmeURL) {
        fetch(readmeURL, { method: "GET" })
          .then((resp) => {
            if (!resp.ok) {
              if (
                resp.status === 400 ||
                resp.status === 403 ||
                resp.status === 404
              )
                return null;
              throw new Error(`${resp.status}: ${resp.statusText}`);
            }
            return resp.text();
          })
          .then(setReadme)
          .catch(() => setReadme(null));
      } else {
        setReadme(null);
      }
    }
  }, [readmeURL, versionMeta, version, path]);

  return (
    <>
      <Head>
        <title>
          {name}
          {version ? `@${version}` : ""}
          {" | Deno"}
        </title>
      </Head>
      <CookieBanner />
      <div className="bg-gray-50 min-h-full">
        <Header
          subtitle={name === "std" ? "Standard Library" : "Third Party Modules"}
        />
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 py-2 pb-8">
          <Breadcrumbs
            name={name}
            version={version}
            path={path}
            isStd={isStd}
          />
          <VersionSelector
            versions={versions?.versions}
            selectedVersion={version}
            onChange={gotoVersion}
          />
          {(() => {
            if (versions === null) {
              return (
                <ErrorMessage
                  title="404 - Not Found"
                  body="This module does not exist."
                />
              );
            } else if (
              versions?.latest === null &&
              versions.versions.length === 0
            ) {
              return (
                <ErrorMessage
                  title="No uploaded versions"
                  body={`This module name has been reserved for a repository, but no versions have been uploaded yet. Modules that do not upload a version within 30 days of registration will be removed. ${
                    versions.isLegacy
                      ? "If you are the owner of this module, please re-add the GitHub repository with deno.land/x (by following the instructions at https://deno.land/x#add), and publish a new version."
                      : ""
                  }`}
                />
              );
            } else if (
              version &&
              versions &&
              !versions?.versions.includes(version)
            ) {
              return (
                <ErrorMessage
                  title="404 - Not Found"
                  body="This version does not exist for this module."
                />
              );
            } else if (
              versionMeta &&
              versionMeta.directoryListing.filter((d) => d.path === path)
                .length === 0
            ) {
              return (
                <ErrorMessage
                  title="404 - Not Found"
                  body="This file or directory could not be found."
                />
              );
            } else if (!dirEntries && typeof raw !== "string") {
              // loading
              return (
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 bg-white">
                  <div className="bg-gray-100 h-10 w-full border-b border-gray-200 px-4 py-3">
                    <div className="w-3/5 sm:w-1/5 bg-gray-200 h-4"></div>
                  </div>
                  <div className="w-full p-4">
                    <div className="w-4/5 sm:w-1/3 bg-gray-100 h-8"></div>
                    <div className="sm:w-2/3 bg-gray-100 h-3 mt-6"></div>
                    <div className="w-5/6 sm:w-3/4 bg-gray-100 h-3 mt-4"></div>
                    <div className="sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                    <div className="w-3/4 bg-gray-100 h-3 mt-4"></div>
                    <div className="sm:w-2/3 bg-gray-100 h-3 mt-4"></div>
                    <div className="w-2/4 sm:w-3/5 bg-gray-100 h-3 mt-4"></div>
                  </div>
                </div>
              );
            } else {
              return (
                <>
                  {versionMeta && dirEntries && (
                    <DirectoryListing
                      name={name}
                      version={version}
                      path={path}
                      dirListing={versionMeta.directoryListing}
                      repositoryURL={repositoryURL}
                    />
                  )}
                  {typeof raw === "string" ? (
                    <div className="mt-4">
                      <FileDisplay
                        raw={raw}
                        canonicalPath={canonicalPath}
                        sourceURL={sourceURL}
                        repositoryURL={repositoryURL}
                        documentationURL={documentationURL}
                      />
                    </div>
                  ) : null}
                  {typeof readme === "string" &&
                  typeof readmeURL === "string" &&
                  typeof readmeCanonicalPath === "string" ? (
                    <div className="mt-4">
                      <FileDisplay
                        raw={readme}
                        canonicalPath={readmeCanonicalPath}
                        sourceURL={readmeURL}
                        repositoryURL={readmeRepositoryURL}
                      />
                    </div>
                  ) : null}
                </>
              );
            }
          })()}
        </div>
        <Footer simple />
      </div>
    </>
  );
};

export function ErrorMessage(props: { title: string; body: string }) {
  return (
    <div className="rounded-md bg-red-50 border border-red-200 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm leading-5 font-medium text-red-800">
            {props.title}
          </h3>
          <div className="mt-2 text-sm leading-5 text-red-700">
            {props.body}
          </div>
        </div>
      </div>
    </div>
  );
}

function Breadcrumbs({
  name,
  version,
  path,
  isStd,
}: {
  name: string;
  version: string | undefined;
  path: string;
  isStd: boolean;
}) {
  const segments = path.split("/").splice(1);
  return (
    <p className="text-gray-500 pt-2 pb-4">
      <Link href="/">
        <a className="link">deno.land</a>
      </Link>{" "}
      /{" "}
      {!isStd && (
        <>
          <Link href="/x">
            <a className="link">x</a>
          </Link>{" "}
          /{" "}
        </>
      )}
      <Link
        href={(!isStd ? "/x" : "") + "/[...rest]"}
        as={`${!isStd ? "/x" : ""}/${name}${version ? `@${version}` : ""}`}
      >
        <a className="link">
          {name}
          {version ? `@${version}` : ""}
        </a>
      </Link>
      {path &&
        path.length > 0 &&
        segments.map((p, i) => {
          const link = segments.slice(0, i + 1).join("/");
          return (
            <React.Fragment key={i}>
              {" "}
              /{" "}
              <Link
                href={(!isStd ? "/x" : "") + "/[...rest]"}
                as={`${!isStd ? "/x" : ""}/${name}${
                  version ? `@${version}` : ""
                }${link ? `/${link}` : ""}`}
              >
                <a className="link">{p}</a>
              </Link>
            </React.Fragment>
          );
        })}
    </p>
  );
}

function VersionSelector({
  versions,
  selectedVersion,
  onChange,
}: {
  versions: string[] | null | undefined;
  selectedVersion: string | undefined;
  onChange: (newVersion: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      <div>
        <label htmlFor="version" className="sr-only">
          Version
        </label>
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <div className="max-w-xs rounded-md shadow-sm">
            <select
              id="version"
              className="block form-select w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              value={selectedVersion}
              onChange={({ target: { value: newVersion } }) =>
                onChange(newVersion)
              }
            >
              {versions && (
                <>
                  {selectedVersion && !versions.includes(selectedVersion) && (
                    <option key={selectedVersion} value={selectedVersion}>
                      {selectedVersion}
                    </option>
                  )}
                  {versions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>
      </div>
      {versions && versions[0] !== selectedVersion ? (
        <div>
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out"
            aria-label="Go to latest version"
            onClick={() => onChange(versions[0])}
          >
            Go to latest
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Registry;
