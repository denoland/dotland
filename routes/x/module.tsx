// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { PageProps, RouteConfig } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { Handlers } from "$fresh/server.ts";
import twas from "$twas";
import { emojify } from "$emoji";
import { accepts } from "$oak_commons";
import {
  DirEntry,
  extractAltLineNumberReference,
  fetchSource,
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
  Module,
  S3_BUCKET,
  VersionDeps,
  VersionInfo,
  VersionMetaInfo,
} from "@/util/registry_utils.ts";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import { FileDisplay } from "@/components/FileDisplay.tsx";
import { DirectoryListing } from "@/components/DirectoryListing.tsx";
import { ErrorMessage } from "@/components/ErrorMessage.tsx";
import { type DocNode, getDocs, type Index } from "@/util/doc.ts";
import * as Icons from "@/components/Icons.tsx";
import VersionSelect from "@/islands/VersionSelect.tsx";

// 100kb
const MAX_SYNTAX_HIGHLIGHT_FILE_SIZE = 100 * 1024;
// 500kb
const MAX_FILE_SIZE = 500 * 1024;

interface Data {
  versions: VersionInfo | null;
  versionMeta: VersionMetaInfo | null;
  moduleMeta: Module | null;
  versionDeps: VersionDeps | null;
  rawFile: Error | { content: string; highlight: boolean } | null;
  readmeFile: string | null;
  dirEntries: DirEntry[] | null;
  repositoryURL: string | undefined;
  sourceURL: string;
  readmeCanonicalPath: string | null;
  readmeURL: string | null;
  readmeRepositoryURL: string | undefined | null;
  doc: DocNode[] | Index | null;
}

type Params = {
  name: string;
  version?: string;
  path: string;
};

export default function Registry({ params, url, data }: PageProps<Data>) {
  let {
    name,
    version,
    path: xPath,
  } = params as Params;
  if (version !== undefined) {
    version = decodeURIComponent(version);
  }
  const path = xPath ? "/" + xPath : "";
  const isStd = name === "std";

  return (
    <>
      <Head>
        <title>{name + (version ? `@${version}` : "") + " | Deno"}</title>
      </Head>
      <div class={tw`bg-[#FFFFFFE5] min-h-full`}>
        <Header
          subtitle={name === "std" ? "Standard Library" : "Third Party Modules"}
          widerContent
        />
        <TopPanel
          version={version!}
          {...{ name, path, isStd, ...data }}
        />
        <div
          class={tw
            `max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-2 pb-8 pt-4`}
        >
          <div class={tw`mt-8`}>
            {(() => {
              if (data.versions === null) {
                return (
                  <ErrorMessage title="404 - Not Found">
                    This module does not exist.
                  </ErrorMessage>
                );
              } else if (
                data.versions.latest === null &&
                data.versions.versions.length === 0
              ) {
                return (
                  <ErrorMessage title="No uploaded versions">
                    This module name has been reserved for a repository, but no
                    versions have been uploaded yet. Modules that do not upload
                    a version within 30 days of registration will be removed.
                    {" "}
                    {data.versions.isLegacy &&
                      "If you are the owner of this module, please re-add the GitHub repository with deno.land/x (by following the instructions at https://deno.land/x#add), and publish a new version."}
                  </ErrorMessage>
                );
              } else if (!data.versions.versions.includes(version!)) {
                return (
                  <ErrorMessage title="404 - Not Found">
                    This version does not exist for this module.
                  </ErrorMessage>
                );
              } else {
                return (
                  <ModuleView
                    version={version!}
                    {...{ name, path, isStd, url, ...data }}
                  />
                );
              }
            })()}
          </div>
        </div>
        <Footer simple />
      </div>
    </>
  );
}

function TopPanel({
  name,
  version,
  path,
  isStd,

  versions,
  versionMeta,
  moduleMeta,
  versionDeps,
}: {
  name: string;
  version: string;
  path: string;
  isStd: boolean;
} & Data) {
  // const externalDependencies = versionDeps === null
  //   ? null
  //   : listExternalDependencies(
  //     versionDeps.graph,
  //     `https://deno.land/x/${name}@${version}${path}`,
  //   );

  return (
    <div class={tw`bg-ultralight border-b-1`}>
      <div
        class={tw
          `max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:h-36 flex items-center`}
      >
        <div
          class={tw
            `flex flex-row flex-wrap justify-between items-center w-full gap-4`}
        >
          <div>
            <Breadcrumbs
              name={name}
              version={version}
              path={path}
              isStd={isStd}
            />
            <div class={tw`text-sm`}>
              {moduleMeta && emojify(moduleMeta.description ?? "")}
            </div>
          </div>
          <div class={tw`flex flex-row flex-wrap items-center gap-4`}>
            {versionMeta && moduleMeta && (
              <div
                class={tw
                  `flex flex-row flex-auto justify-center items-center gap-4 border border-dark-border rounded-md bg-white py-2 px-5`}
              >
                <div class={tw`flex items-center`}>
                  <Icons.GitHub class="mr-2 w-5 h-5 inline text-gray-700" />
                  <a
                    class={tw`link`}
                    href={`https://github.com/${versionMeta.uploadOptions.repository}`}
                  >
                    {versionMeta.uploadOptions.repository}
                  </a>
                </div>
                <div class={tw`flex items-center`}>
                  <Icons.Star class="mr-2" title="GitHub Stars" />
                  <div>{moduleMeta.star_count}</div>
                </div>
              </div>
            )}
            <div class={tw`flex-auto`}>
              <VersionSelector
                versions={versions!.versions}
                selectedVersion={version}
                name={name}
                isStd={isStd}
                path={path}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleView({
  name,
  version,
  path,
  isStd,
  url,

  versions,
  versionMeta,
  moduleMeta,
  versionDeps,
  rawFile,
  readmeFile,
  dirEntries,
  repositoryURL,
  sourceURL,
  readmeCanonicalPath,
  readmeURL,
  readmeRepositoryURL,
  doc,
}: {
  name: string;
  version: string;
  path: string;
  isStd: boolean;
  url: URL;
} & Data) {
  const stdVersion = isStd ? version : undefined;

  const basePath = getBasePath({ isStd, name, version });
  const canonicalPath = `${basePath}${path}`;

  return (
    <div>
      {(() => {
        if (!versionMeta?.directoryListing.find((d) => d.path === path)) {
          return (
            <ErrorMessage title="404 - Not Found">
              This file or directory could not be found.
            </ErrorMessage>
          );
        } else if (dirEntries === null && rawFile === null) {
          // No files
          return (
            <div
              class={tw
                `rounded-lg overflow-hidden border border-gray-200 bg-white`}
            >
              {versionMeta && (
                <DirectoryListing
                  name={name}
                  version={version}
                  path={path}
                  dirListing={versionMeta.directoryListing}
                  repositoryURL={repositoryURL}
                  url={url}
                  index={doc as Index}
                />
              )}
              <div class={tw`w-full p-4 text-gray-400 italic`}>No files.</div>
            </div>
          );
        } else if (rawFile instanceof Error) {
          return (
            <div
              class={tw
                `rounded-lg overflow-hidden border border-gray-200 bg-white`}
            >
              {versionMeta && (
                <DirectoryListing
                  name={name}
                  version={version}
                  path={path}
                  dirListing={versionMeta.directoryListing}
                  repositoryURL={repositoryURL}
                  url={url}
                  index={doc as Index}
                />
              )}
              <div class={tw`w-full p-4 text-gray-400 italic`}>
                {rawFile.message}
              </div>
            </div>
          );
        } else {
          return (
            <div class={tw`flex flex-col gap-4`}>
              {versionMeta && dirEntries && (
                <DirectoryListing
                  name={name}
                  version={version}
                  path={path}
                  dirListing={versionMeta.directoryListing}
                  repositoryURL={repositoryURL}
                  url={url}
                  index={doc as Index}
                />
              )}
              {rawFile !== null && (
                <FileDisplay
                  raw={rawFile.content}
                  filetypeOverride={rawFile.highlight ? undefined : "text"}
                  canonicalPath={canonicalPath}
                  sourceURL={sourceURL}
                  repositoryURL={repositoryURL}
                  baseURL={basePath}
                  stdVersion={stdVersion}
                  url={url}
                  docNodes={doc as DocNode[]}
                />
              )}
              {typeof readmeFile === "string" &&
                typeof readmeURL === "string" &&
                typeof readmeCanonicalPath === "string" && (
                <FileDisplay
                  raw={readmeFile}
                  canonicalPath={readmeCanonicalPath}
                  sourceURL={readmeURL}
                  repositoryURL={readmeRepositoryURL}
                  baseURL={basePath}
                  stdVersion={stdVersion}
                  url={url}
                  docNodes={doc as DocNode[]}
                />
              )}
            </div>
          );
        }
      })()}
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
  segments.unshift(name + (version ? `@${version}` : ""));
  if (!isStd) {
    segments.unshift("x");
  }

  let seg = "";
  const out: [string, string][] = [];
  for (const segment of segments) {
    seg += "/" + segment;
    out.push([segment, seg]);
  }

  return (
    <p class={tw`text-xl leading-6 font-bold`}>
      {out.map(([seg, url], i) => {
        return (
          <Fragment key={i}>
            {i !== 0 && "/"}
            {i === (segments.length - 1)
              ? <span class={tw`text-black`}>{seg}</span>
              : (
                <a href={url} class={tw`link`}>
                  {seg}
                </a>
              )}
          </Fragment>
        );
      })}
    </p>
  );
}

function VersionSelector({
  versions,
  selectedVersion,
  name,
  isStd,
  path,
}: {
  versions: string[];
  selectedVersion: string;
  name: string;
  isStd: boolean;
  path: string;
}) {
  return (
    <div class={tw`w-full`}>
      <VersionSelect
        versions={Object.fromEntries(
          versions.map((
            ver,
          ) => [ver, `/${isStd ? "" : "x/"}${name}@${ver}${path}`]),
        )}
        selectedVersion={selectedVersion}
      />
      {versions[0] !== selectedVersion && (
        <a
          class={tw
            `mt-2 w-full inline-flex justify-center py-1 px-2 border border-red-300 rounded-md text-sm leading-5 font-medium text-red-500 hover:text-red-400 focus:(outline-none border-blue-300 shadow-outline-red) transition duration-150 ease-in-out`}
          aria-label="Go to latest version"
          href={`/${isStd ? "" : "x/"}${name}@${versions[0]}${path}`}
        >
          Go to latest
        </a>
      )}
    </div>
  );
}

export const handler: Handlers<Data> = {
  async GET(req, { params, render }) {
    let {
      name,
      version,
      path: xPath,
    } = params as Params;
    const url = new URL(req.url);
    const isHTML = accepts(req, "application/*", "text/html") === "text/html";

    const path = xPath ? "/" + xPath : "";
    const isStd = name === "std";

    if (!version) {
      const versions = await getVersionList(name);
      if (!versions?.latest) {
        if (isHTML) {
          // @ts-ignore will take care of this on a later date
          return render!({ versions });
        } else {
          return new Response(
            `The module '${params.name}' has no latest version`,
            {
              status: 404,
              headers: {
                "content-type": "text/plain",
                "Access-Control-Allow-Origin": "*",
              },
            },
          );
        }
      }

      return new Response(undefined, {
        headers: {
          Location: `/${isStd ? name : "x/" + name}@${versions!.latest}${path}`,
          "x-deno-warning": `Implicitly using latest version (${
            versions!.latest
          }) for ${url.href}`,
          "Access-Control-Allow-Origin": "*",
        },
        status: 302,
      });
    }

    if (!isHTML) {
      const remoteUrl =
        `${S3_BUCKET}${params.name}/versions/${params.version}/raw/${params.path}`;
      const resp = await fetchSource(remoteUrl);

      if (
        remoteUrl.endsWith(".jsx") &&
        !resp.headers.get("content-type")?.includes("javascript")
      ) {
        resp.headers.set("content-type", "application/javascript");
      } else if (
        remoteUrl.endsWith(".tsx") &&
        !resp.headers.get("content-type")?.includes("typescript")
      ) {
        resp.headers.set("content-type", "application/typescript");
      }

      resp.headers.set("Access-Control-Allow-Origin", "*");
      return resp;
    }

    const ln = extractAltLineNumberReference(url.toString());
    if (ln) {
      return Response.redirect(`${ln.rest}?codeview=#L${ln.line}`, 302);
    }

    version = decodeURIComponent(params.version);
    const versions = await getVersionList(params.name).catch((e) => {
      console.error("Failed to fetch versions:", e);
      return null;
    });

    const canRenderView = !(versions === null) &&
      !(versions.latest === null && versions.versions.length === 0) &&
      !(!versions.versions.includes(version!));

    if (canRenderView) {
      const [versionMeta, moduleMeta, versionDeps, doc] = await Promise
        .all([
          getVersionMeta(params.name, version).catch((e) => {
            console.error("Failed to fetch dir entry:", e);
            return null;
          }),
          getModule(params.name).catch((e) => {
            console.error("Failed to fetch module meta:", e);
            return null;
          }),
          getVersionDeps(params.name, version).catch((e) => {
            console.error("Failed to fetch dependency information:", e);
            return null;
          }),
          getDocs(params.name, version!, path).catch((e) => {
            console.error("Failed to fetch documentation:", e);
            return null;
          }),
        ]);

      const sourceURL = getSourceURL(params.name, version, path);
      const basePath = getBasePath({ isStd, name, version });
      const canonicalPath = `${basePath}${path}`;

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
        } else {
          return null;
        }
      })();

      const repositoryURL = versionMeta
        ? dirEntries
          ? getRepositoryURL(versionMeta, path, "tree")
          : getRepositoryURL(versionMeta, path)
        : undefined;
      const {
        readmeSize,
        readmeCanonicalPath,
        readmeURL,
        readmeRepositoryURL,
      } = (() => {
        const readmeEntry = path === ""
          ? findRootReadme(versionMeta?.directoryListing)
          : dirEntries?.find((d) => isReadme(d.name));
        if (readmeEntry) {
          return {
            readmeSize: readmeEntry.size,
            readmeCanonicalPath: canonicalPath + "/" + readmeEntry.name,
            readmeURL: getSourceURL(
              name,
              version,
              path + "/" + readmeEntry.name,
            ),
            readmeRepositoryURL: versionMeta
              ? getRepositoryURL(versionMeta, path + "/" + readmeEntry.name)
              : null,
          };
        }
        return {
          readmeSize: null,
          readmeCanonicalPath: null,
          readmeURL: null,
          readmeRepositoryURL: null,
        };
      })();

      const [rawFile, readmeFile] = await Promise.all([
        (async () => {
          if (
            sourceURL &&
            versionMeta &&
            versionMeta.directoryListing.filter(
                (d) => d.path === path && d.type == "file",
              ).length !== 0
          ) {
            const res = await fetch(sourceURL, { method: "GET" });
            if (!res.ok) {
              await res.body?.cancel();
              if (
                res.status !== 400 &&
                res.status !== 403 &&
                res.status !== 404
              ) {
                console.error(new Error(`${res.status}: ${res.statusText}`));
              }
              return null;
            }

            const size = versionMeta.directoryListing.find(
              (entry) => entry.path === path,
            )!.size!;
            if (size < MAX_SYNTAX_HIGHLIGHT_FILE_SIZE) {
              return {
                content: await res.text(),
                highlight: true,
              };
            } else if (size < MAX_FILE_SIZE) {
              return {
                content: await res.text(),
                highlight: false,
              };
            } else {
              await res.body!.cancel();
              return new Error("Max display filesize exceeded");
            }
          } else {
            return null;
          }
        })(),
        (async () => {
          if (readmeURL) {
            const res = await fetch(readmeURL);
            if (!res.ok) {
              await res.body?.cancel();
              if (
                res.status !== 400 &&
                res.status !== 403 &&
                res.status !== 404
              ) {
                console.error(new Error(`${res.status}: ${res.statusText}`));
              }
              return null;
            }
            if (readmeSize! < MAX_SYNTAX_HIGHLIGHT_FILE_SIZE) {
              return await res.text();
            } else {
              await res.body!.cancel();
              return null;
            }
          } else {
            return null;
          }
        })(),
      ]);

      return render!({
        versions,
        versionMeta,
        moduleMeta,
        versionDeps,
        rawFile,
        readmeFile,
        dirEntries,
        repositoryURL,
        sourceURL,
        readmeCanonicalPath,
        readmeURL,
        readmeRepositoryURL,
        doc,
      });
    } else {
      // @ts-ignore will take care of this on a later date
      return render!({ versions });
    }
  },
};

export const config: RouteConfig = {
  routeOverride: "/x/:name{@:version}?/:path*",
};
