/* Copyright 2022 the Deno authors. All rights reserved. MIT license. */

/** @jsx h */
/** @jsxFrag Fragment */
import {
  Fragment,
  h,
  PageConfig,
  PageProps,
  since,
  useData,
} from "../../deps.ts";
import { HandlerContext, Handlers } from "../../server_deps.ts";
import {
  denoDocAvailableForURL,
  DirEntry,
  findRootReadme,
  getBasePath,
  getModule,
  getRepositoryURL,
  getSourceURL,
  getVersionDeps,
  getVersionList,
  getVersionMeta,
  isReadme,
  listExternalDependencies,
} from "../../util/registry_utils.ts";
import { replaceEmojis } from "../../util/emoji_util.ts";
import { Header } from "../../components/Header.tsx";
import { Footer } from "../../components/Footer.tsx";
import { FileDisplay } from "../../components/FileDisplay.tsx";
import { DirectoryListing } from "../../components/DirectoryListing.tsx";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";

export default function Registry({ params, url }: PageProps) {
  const { name, version, path } = params;
  const versions = useData(name, () => {
    if (name) {
      return getVersionList(name)
        .catch((e) => {
          console.error("Failed to fetch versions:", e);
          return null;
        });
    } else {
      return Promise.resolve(null);
    }
  });
  const versionMeta = useData(`versionMeta/${name}@${version}`, () => {
    if (version) {
      if (name) {
        return getVersionMeta(name, version)
          .catch((e) => {
            console.error("Failed to fetch dir entry:", e);
            return null;
          });
      } else {
        return Promise.resolve(null);
      }
    }
  });
  const moduleMeta = useData(`moduleMeta/${name}`, () => {
    if (name) {
      return getModule(name)
        .catch((e) => {
          console.f("Failed to fetch module meta:", e);
          return null;
        });
    }
  });
  const versionDeps = useData(`deps/${name}@${version}`, () => {
    if (version) {
      if (name) {
        getVersionDeps(name, version)
          .catch((e) => {
            console.error("Failed to fetch dependency information:", e);
            return null;
          });
      } else {
        return null;
      }
    }
  });

  const isStd = name === "std";
  const stdVersion = isStd ? version || versions?.latest : undefined;

  const basePath = getBasePath({ isStd, name, version });
  const canonicalPath = `${basePath}${path}`;
  const sourceURL = getSourceURL(name, version, path);
  const documentationURL = denoDocAvailableForURL(canonicalPath)
    ? `https://doc.deno.land/https://deno.land${canonicalPath}`
    : null;

  const raw = useData(sourceURL, async () => {
    if (version) {
      if (
        sourceURL &&
        versionMeta &&
        versionMeta.directoryListing.filter(
            (d) => d.path === path && d.type == "file",
          ).length !== 0
      ) {
        const res = await fetch(sourceURL, { method: "GET" });
        if (!res.ok) {
          if (
            res.status !== 400 &&
            res.status !== 403 &&
            res.status !== 404
          ) {
            console.error(new Error(`${res.status}: ${res.statusText}`));
          }
          return null;
        }
        return await res.text();
      } else {
        return null;
      }
    }
  });

  // Get directory entries for path
  const dirEntries = (() => {
    if (versionMeta) {
      const files = versionMeta.directoryListing
        .filter(
          (f) =>
            f.path.startsWith(path + "/") &&
            f.path.split("/").length - 2 === path.split("/").length - 1,
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
  })();

  const repositoryURL = versionMeta
    ? dirEntries
      ? getRepositoryURL(versionMeta, path, "tree")
      : getRepositoryURL(versionMeta, path)
    : undefined;
  const {
    readmeCanonicalPath,
    readmeURL,
    readmeRepositoryURL,
  } = (() => {
    const readmeEntry = path === ""
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
  })();

  const readme = useData(sourceURL, async () => {
    if (version) {
      if (readmeURL) {
        const res = await fetch(readmeURL, { method: "GET" });
        if (!res.ok) {
          if (
            res.status !== 400 &&
            res.status !== 403 &&
            res.status !== 404
          ) {
            console.error(new Error(`${resp.status}: ${resp.statusText}`));
          }
          return null;
        }
        return res.text();
      } else {
        return null;
      }
    }
  });

  // TODO: If std version starts with v, redirect to version without v

  const externalDependencies = versionDeps === undefined
    ? undefined
    : versionDeps === null
    ? null
    : listExternalDependencies(
      versionDeps.graph,
      `https://deno.land/x/${name}@${version}${path}`,
    );

  return (
    <>
      <head>
        <title>
          {name + (version ? `@${version}` : "") + " | Deno"}
        </title>
      </head>
      <div className="bg-gray-50 min-h-full">
        <Header
          subtitle={name === "std" ? "Standard Library" : "Third Party Modules"}
          widerContent={true}
        />
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-2 pb-8 pt-4">
          <Breadcrumbs
            name={name}
            version={version}
            path={path}
            isStd={isStd}
          />
          <div className="mt-8">
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
              }
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    {(() => {
                      if (
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
                        versionMeta.directoryListing.filter(
                            (d) => d.path === path,
                          ).length === 0
                      ) {
                        return (
                          <ErrorMessage
                            title="404 - Not Found"
                            body="This file or directory could not be found."
                          />
                        );
                      } else if (
                        typeof dirEntries === "undefined" &&
                        typeof raw !== "string"
                      ) {
                        throw Error("unreachable");
                      } else if (
                        dirEntries === null &&
                        typeof raw !== "string"
                      ) {
                        // No files
                        return (
                          <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
                            {versionMeta && (
                              <DirectoryListing
                                name={name}
                                version={version}
                                path={path}
                                dirListing={versionMeta.directoryListing}
                                repositoryURL={repositoryURL}
                                pathname={url.pathname}
                              />
                            )}
                            <div className="w-full p-4 text-gray-400 italic">
                              No files.
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex flex-col gap-4">
                            {versionMeta && dirEntries && (
                              <DirectoryListing
                                name={name}
                                version={version}
                                path={path}
                                dirListing={versionMeta.directoryListing}
                                repositoryURL={repositoryURL}
                                pathname={url.pathname}
                              />
                            )}
                            {typeof raw === "string"
                              ? (
                                <FileDisplay
                                  raw={raw}
                                  canonicalPath={canonicalPath}
                                  sourceURL={sourceURL}
                                  repositoryURL={repositoryURL}
                                  documentationURL={documentationURL}
                                  baseURL={basePath}
                                  stdVersion={stdVersion}
                                  pathname={url.pathname}
                                />
                              )
                              : null}
                            {typeof readme === "string" &&
                                typeof readmeURL === "string" &&
                                typeof readmeCanonicalPath === "string"
                              ? (
                                <FileDisplay
                                  raw={readme}
                                  canonicalPath={readmeCanonicalPath}
                                  sourceURL={readmeURL}
                                  repositoryURL={readmeRepositoryURL}
                                  baseURL={basePath}
                                  stdVersion={stdVersion}
                                  pathname={url.pathname}
                                />
                              )
                              : null}
                          </div>
                        );
                      }
                    })()}
                  </div>
                  <div className="col-span-1 row-start-1 md:row-start-auto flex flex-col sm:flex-row md:flex-col gap-4">
                    <div className="max-w-sm w-full shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 p-4">
                        <div className="text-xl font-bold">{name}</div>
                        {versionMeta === undefined ||
                            moduleMeta === undefined
                          ? (
                            <>
                              <div className="w-4/5 sm:w-full bg-gray-100 h-3 my-2">
                              </div>
                              <div className="w-4/5 sm:w-2/3 bg-gray-100 h-3 my-2 block sm:hidden md:block">
                              </div>
                              <div className="mt-3 flex items-center py-0.5">
                                <svg
                                  className="h-5 w-5 mr-2 inline text-gray-200"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <title>
                                    GitHub Repository
                                  </title>
                                  <path
                                    fillRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <div className="w-4/5 sm:w-2/3 bg-gray-100 h-4">
                                </div>
                              </div>
                              <div className="mt-2 flex items-center py-0.5">
                                <svg
                                  className="h-5 w-5 mr-2 inline text-gray-200"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <title>
                                    GitHub Stars
                                  </title>
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                  </path>
                                </svg>
                                <div className="w-1/6 sm:w-1/5 bg-gray-100 h-4">
                                </div>
                              </div>
                            </>
                          )
                          : versionMeta === null ||
                              moduleMeta === null
                          ? null
                          : (
                            <>
                              <div className="text-sm">
                                {replaceEmojis(moduleMeta.description ?? "")}
                              </div>
                              <div className="mt-3 flex items-center">
                                <svg
                                  className="h-5 w-5 mr-2 inline text-gray-700"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <title>
                                    GitHub Repository
                                  </title>
                                  <path
                                    fillRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <a
                                  className="link"
                                  href={`https://github.com/${versionMeta.uploadOptions.repository}`}
                                >
                                  {versionMeta.uploadOptions.repository}
                                </a>
                              </div>
                              <div className="mt-2 flex items-center">
                                <svg
                                  className="h-5 w-5 mr-2 inline text-gray-700"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <title>
                                    GitHub Stars
                                  </title>
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                  </path>
                                </svg>
                                <div>
                                  {moduleMeta.star_count}
                                </div>
                              </div>
                            </>
                          )}
                        <div className="mt-3 w-full">
                          {
                            /* TODO <VersionSelector
                            versions={versions?.versions}
                            selectedVersion={version}
                            onChange={gotoVersion}
                          />*/
                          }
                        </div>
                      </div>
                    </div>

                    <div className="max-w-sm w-full shadow-sm rounded-lg border border-gray-200 p-4">
                      <p className="text-md font-semibold mb-2">Version Info</p>
                      {versionMeta === undefined
                        ? (
                          <div className="mt-2 flex items-center py-0.5">
                            <svg
                              className="h-5 w-5 mr-2 inline text-gray-200"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <title>
                                Tagged at
                              </title>
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div className="w-4/5 sm:w-2/3 bg-gray-100 h-4">
                            </div>
                          </div>
                        )
                        : versionMeta === null
                        ? null
                        : (
                          <div className="mt-2 flex text-sm items-center">
                            <svg
                              className="h-5 w-5 mr-2 inline text-gray-700"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <title>
                                Tagged at
                              </title>
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div
                              title={versionMeta.uploadedAt.toLocaleString()}
                            >
                              {since(versionMeta.uploadedAt.getTime())}
                            </div>
                          </div>
                        )}
                    </div>
                    {documentationURL && externalDependencies !== null
                      ? (
                        <div className="max-w-sm w-full shadow-sm rounded-lg border border-gray-200 p-4">
                          <p className="text-md font-semibold mb-2">
                            External Dependencies
                          </p>
                          {externalDependencies === undefined
                            ? (
                              <>
                                <div className="w-3/4 sm:w-2/3 bg-gray-100 h-3 mt-1">
                                </div>
                                <div className="w-5/6 sm:w-4/5 bg-gray-100 h-3 mt-1">
                                </div>
                                <div className="w-5/6 sm:w-4/5 bg-gray-100 h-3 mt-1">
                                </div>
                              </>
                            )
                            : externalDependencies === null
                            ? null
                            : (
                              <>
                                <div className="mt-2 overflow-x-auto">
                                  {externalDependencies.map((
                                    url,
                                  ) => (
                                    <p key={url}>
                                      {url.startsWith("https://deno.land/")
                                        ? (
                                          <a
                                            href={url.replace(
                                              "https://deno.land",
                                              "",
                                            )}
                                            className="link text-sm truncate"
                                          >
                                            {url}
                                          </a>
                                        )
                                        : (
                                          <a
                                            href={url}
                                            className="link text-sm truncate"
                                          >
                                            {url}
                                          </a>
                                        )}
                                    </p>
                                  ))}
                                </div>
                                <div className="text-sm mt-2 italic">
                                  {externalDependencies.length === 0
                                    ? "No external dependencies 🎉"
                                    : externalDependencies.length +
                                      (externalDependencies.length === 1
                                        ? " external dependency"
                                        : " external dependencies")}
                                </div>
                              </>
                            )}
                        </div>
                      )
                      : null}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        <Footer simple />
      </div>
    </>
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
    <p className="text-gray-500">
      <a href="/" className="link">deno.land</a> / {!isStd && (
        <>
          <a href="/x" className="link">x</a> /{" "}
        </>
      )}
      <a className="link" href={getBasePath({ isStd, name, version })}>
        {name}
        {version ? `@${version}` : ""}
      </a>
      {path &&
        path.length > 0 &&
        segments.map((p, i) => {
          const link = segments.slice(0, i + 1).join("/");
          return (
            <Fragment key={i}>
              {" "}
              /{" "}
              <a
                href={`${getBasePath({ isStd, name, version })}${
                  link ? `/${link}` : ""
                }`}
                className="link"
              >
                {p}
              </a>
            </Fragment>
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
    <div className="gap-2 w-full">
      <label htmlFor="version" className="sr-only">
        Version
      </label>
      <div className="max-w-xs rounded-md shadow-sm w-full">
        {versions
          ? (
            <select
              id="version"
              className="block form-select w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              value={selectedVersion}
              onChange={({ target: { value: newVersion } }) =>
                onChange(newVersion)}
            >
              <>
                {selectedVersion && !versions.includes(selectedVersion) &&
                  (
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
            </select>
          )
          : (
            <div className="block form-select w-full bg-gray-50 h-9 pb-0.5 sm:text-sm">
            </div>
          )}
      </div>
      {versions && versions[0] !== selectedVersion
        ? (
          <button
            type="button"
            className="mt-2 w-full inline-flex justify-center py-1 px-2 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out"
            aria-label="Go to latest version"
            onClick={() => onChange(versions[0])}
          >
            Go to latest
          </button>
        )
        : null}
    </div>
  );
}

export const handler: Handlers = {
  async GET({ req, match, render }) {
    console.log(match);
    if (!match.version) {
      const version = await getVersionList(match.name);
      if (version === null) {
        render();
        return;
      }
      const url = new URL(req.url);
      url.pathname = `/x/${match.name}@${version.latest}/${match.path}`;
      return Response.redirect(url);
    }
    render();
  },
};
export const config: PageConfig = {
  routeOverride: "/x/:name{@:version}?/:path*",
};
