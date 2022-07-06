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
  getBasePath,
  getDirEntries,
  getModule,
  getModulePath,
  getRawFile,
  getReadme,
  getRepositoryURL,
  getVersionDeps,
  getVersionList,
  getVersionMeta,
  listExternalDependencies,
  Module,
  RawFile,
  Readme,
  S3_BUCKET,
  VersionDeps,
  VersionInfo,
  VersionMetaInfo,
} from "@/util/registry_utils.ts";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import { ErrorMessage } from "@/components/ErrorMessage.tsx";
import { DocView } from "@/components/DocView.tsx";
import * as Icons from "@/components/Icons.tsx";
import { type Doc, getDocs } from "@/util/doc.ts";
import VersionSelect from "@/islands/VersionSelect.tsx";
import { CodeView } from "@/components/CodeView.tsx";

type MaybeData = { versions: VersionInfo | null } | Data;

interface Data {
  versions: VersionInfo | null;

  versionMeta: VersionMetaInfo;
  moduleMeta: Module;
  versionDeps: VersionDeps | null;
  dirEntries: DirEntry[] | null;
  readme: Readme | null;
  repositoryURL: string;
  showCode: boolean;
  data: Doc | RawFile | Error | null;
}

type Params = {
  name: string;
  version?: string;
  path: string;
};

export default function Registry({ params, url, data }: PageProps<MaybeData>) {
  let {
    name,
    version,
    path: maybePath,
  } = params as Params;
  version &&= decodeURIComponent(version);

  const path = maybePath ? "/" + maybePath : "";
  const isStd = name === "std";

  return (
    <>
      <Head>
        <title>{name + (version ? `@${version}` : "") + " | Deno"}</title>
      </Head>
      <div class={tw`bg-primary min-h-full`}>
        <Header
          selected={name === "std" ? "标准库" : "第三方模块"}
        />
        <TopPanel
          version={version!}
          {...{ name, path, isStd, ...(data as Data) }}
        />
        <div class={tw`section-x-inset-xl pb-8 pt-12`}>
          <div class={tw`flex gap-x-14`}>
            <ModuleView
              version={version!}
              {...{ name, path, isStd, url, ...(data as Data) }}
            />
          </div>
        </div>
        <Footer />
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
      <div class={tw`section-x-inset-xl py-8 md:h-36 flex items-center`}>
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
            {versions && (
              <VersionSelector
                versions={versions!.versions}
                selectedVersion={version}
                name={name}
                path={path}
              />
            )}
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
  readme,
  dirEntries,
  repositoryURL,

  showCode,
  data,
}: {
  name: string;
  version: string;
  path: string;
  isStd: boolean;
  url: URL;
} & Data) {
  const basePath = getBasePath({ isStd, name, version });

  if (versions === null) {
    return (
      <ErrorMessage title="404 - Not Found">
        This module does not exist.
      </ErrorMessage>
    );
  } else if (versions.latest === null && versions.versions.length === 0) {
    return (
      <ErrorMessage title="No uploaded versions">
        This module name has been reserved for a repository, but no versions
        have been uploaded yet. Modules that do not upload a version within 30
        days of registration will be removed. {versions.isLegacy &&
          "If you are the owner of this module, please re-add the GitHub repository with deno.land/x (by following the instructions at https://deno.land/x#add), and publish a new version."}
      </ErrorMessage>
    );
  } else if (!versions.versions.includes(version!)) {
    return (
      <ErrorMessage title="404 - Not Found">
        This version does not exist for this module.
      </ErrorMessage>
    );
  } else if (!versionMeta?.directoryListing.find((d) => d.path === path)) {
    return (
      <ErrorMessage title="404 - Not Found">
        This file or directory could not be found.
      </ErrorMessage>
    );
  }

  if (showCode) {
    return (
      <CodeView
        {...{
          rawFile: data as RawFile,
          dirEntries,
          repositoryURL,
          versionMeta,
          moduleMeta,
          isStd,
          name,
          version,
          path,
          readme,
          basePath,
          url,
        }}
      />
    );
  } else {
    return (
      <DocView
        {...{
          ...(data as Doc),
          dirEntries,
          repositoryURL,
          versionMeta,
          moduleMeta,
          isStd,
          name,
          version,
          path,
          readme,
          basePath,
          url,
        }}
      />
    );
  }
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
  path,
}: {
  versions: string[];
  selectedVersion: string;
  name: string;
  path: string;
}) {
  return (
    <div class={tw`flex-auto`}>
      <div class={tw`w-full`}>
        <VersionSelect
          versions={Object.fromEntries(
            versions.map((ver) => [ver, getModulePath(name, ver, path)]),
          )}
          selectedVersion={selectedVersion}
        />
        {versions[0] !== selectedVersion && (
          <a
            class={tw
              `mt-2 w-full inline-flex justify-center py-1 px-2 bg-white border border-red-300 rounded-md text-sm leading-5 font-medium text-red-500 hover:text-red-400 focus:(outline-none border-blue-300 shadow-outline-red) transition duration-150 ease-in-out`}
            aria-label="Go to latest version "
            href={getModulePath(name, versions[0], path)}
          >
            Go to latest
          </a>
        )}
      </div>
    </div>
  );
}

export const handler: Handlers<MaybeData> = {
  async GET(req, { params, render }) {
    let {
      name,
      version,
      path: maybePath,
    } = params as Params;
    const url = new URL(req.url);
    const isHTML = accepts(req, "application/*", "text/html") === "text/html";

    const path = maybePath ? "/" + maybePath : "";
    const isStd = name === "std";

    if (!version) {
      const versions = await getVersionList(name);
      if (!versions?.latest) {
        if (isHTML) {
          return render!({ versions });
        } else {
          return new Response(
            `The module '${name}' has no latest version`,
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
          Location: getModulePath(name, versions!.latest, path),
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
        `${S3_BUCKET}${name}/versions/${version}/raw/${params.path}`;
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

    const ln = extractAltLineNumberReference(url.href);
    if (ln) {
      url.pathname = ln.rest;
      url.searchParams.set("code", "");
      url.hash = "L" + ln.line;
      return Response.redirect(url, 302);
    }

    version = decodeURIComponent(version!);

    const versions = await getVersionList(params.name).catch((e) => {
      console.error("Failed to fetch versions:", e);
      return null;
    });

    const canRenderView = versions && versions.latest &&
      versions.versions.includes(version);

    if (canRenderView) {
      const code = url.searchParams.has("code") || !isStd; // TODO(@crowlKats): remove isStd check once performance is adequate

      const [versionMeta, moduleMeta, versionDeps, doc] = await Promise
        .all([
          getVersionMeta(name, version),
          getModule(name),
          getVersionDeps(name, version),
          !code ? getDocs(name, version, path) : null,
        ]);

      const dirEntries = getDirEntries(versionMeta, path);
      const canonicalPath = getModulePath(name, version, path);
      const repositoryURL = getRepositoryURL(
        versionMeta,
        path,
        dirEntries ? "tree" : undefined,
      );

      const [readme, file] = await Promise.all([
        getReadme(
          name,
          version,
          path,
          canonicalPath,
          versionMeta,
          dirEntries,
        ),
        // if code view is requested or docs are not available, fetch the file
        !doc
          ? getRawFile(
            name,
            version,
            path,
            canonicalPath,
            versionMeta,
          )
          : null,
      ]);

      return render!({
        versions,

        versionMeta,
        moduleMeta,
        versionDeps,
        dirEntries,
        readme,
        repositoryURL,
        showCode: !doc,
        data: doc ?? file,
      });
    } else {
      return render!({ versions });
    }
  },
};

export const config: RouteConfig = {
  routeOverride: "/x/:name{@:version}?/:path*",
};
