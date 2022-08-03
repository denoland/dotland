// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import twas from "$twas";
import { emojify } from "$emoji";
import { accepts } from "$oak_commons";
import {
  CodePage,
  DocPage,
  extractAltLineNumberReference,
  fetchSource,
  getModulePath,
  getRawFile,
  getReadme,
  getRepositoryURL,
  S3_BUCKET,
} from "@/util/registry_utils.ts";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import { ErrorMessage } from "@/components/ErrorMessage.tsx";
import { DocView } from "@/components/DocView.tsx";
import * as Icons from "@/components/Icons.tsx";
import VersionSelect from "@/islands/VersionSelect.tsx";
import { CodeView } from "@/components/CodeView.tsx";

type Params = {
  name: string;
  version: string;
  path: string;
};

type Data =
  | { data: DocPage; isCode: false }
  | { data: CodePage; isCode: true };
type MaybeData =
  | Data
  | null;

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
          selected={name === "std" ? "Standard Library" : "Third Party Modules"}
        />
        {data === null
          ? (
            <div class={tw`section-x-inset-xl pb-20 pt-10`}>
              <ErrorMessage title="404 - Not Found">
                This module does not exist.
              </ErrorMessage>
            </div>
          )
          : (
            <>
              <TopPanel
                version={version!}
                {...{ name, path, isStd, ...data }}
              />
              <div class={tw`section-x-inset-xl pb-20 pt-10 flex gap-x-14`}>
                <ModuleView
                  version={version!}
                  {...{ name, path, isStd, url, data }}
                />
              </div>
            </>
          )}
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
  data,
  isCode,
}: {
  name: string;
  version: string;
  path: string;
  isStd: boolean;
} & Data) {
  return (
    <div class={tw`bg-ultralight border-b border-light-border`}>
      <div class={tw`section-x-inset-xl py-5 flex items-center`}>
        <div
          class={tw`flex flex-row flex-wrap justify-between items-center w-full gap-4`}
        >
          <div>
            <Breadcrumbs
              name={name}
              version={version}
              path={path}
              isStd={isStd}
              isCode={isCode}
            />
            <div class={tw`text-sm`}>
              {data.description && emojify(data.description)}
            </div>
          </div>
          <div
            class={tw`flex flex-col items-stretch gap-4 w-full md:(flex-row w-auto items-center)`}
          >
            {data.kind !== "invalid-version" && (
              <div
                class={tw`flex flex-row flex-auto justify-center items-center gap-4 border border-dark-border rounded-md bg-white py-2 px-5`}
              >
                <div class={tw`flex items-center`}>
                  <Icons.GitHub class="mr-2 w-5 h-5 inline text-gray-700" />
                  <a
                    class={tw`link`}
                    href={`https://github.com/${data.upload_options.repository}`}
                  >
                    {data.upload_options.repository}
                  </a>
                </div>
                <div class={tw`flex items-center`}>
                  <Icons.Star class="mr-2" title="GitHub Stars" />
                  <div>{data.star_count}</div>
                </div>
              </div>
            )}
            <VersionSelector
              versions={data.versions}
              selectedVersion={version}
              name={name}
              path={path}
            />
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
  data,
}: {
  name: string;
  version: string;
  path: string;
  isStd: boolean;
  url: URL;
  data: Data;
}) {
  if (data.data.versions.length === 0) {
    return (
      <ErrorMessage title="No uploaded versions">
        This module name has been reserved for a repository, but no versions
        have been uploaded yet. Modules that do not upload a version within 30
        days of registration will be removed.
      </ErrorMessage>
    );
  } else if (data.data.kind === "invalid-version") {
    return (
      <ErrorMessage title="404 - Not Found">
        This version does not exist for this module.
      </ErrorMessage>
    );
  } else if (data.data.kind === "notfound") {
    return (
      <ErrorMessage title="404 - Not Found">
        This file or directory could not be found.
      </ErrorMessage>
    );
  }

  const repositoryURL = getRepositoryURL(
    data.data.upload_options,
    path,
    data.data.kind === "index" ? "tree" : undefined,
  );

  if (data.isCode) {
    return (
      <CodeView
        {...{
          isStd,
          name,
          version,
          path,
          url,
          data: data.data,
          repositoryURL,
        }}
      />
    );
  } else {
    return (
      <DocView
        {...{
          isStd,
          name,
          version,
          path,
          url,
          data: data.data,
          repositoryURL,
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
  isCode,
}: {
  name: string;
  version: string | undefined;
  path: string;
  isStd: boolean;
  isCode: boolean;
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
    <p class={tw`text-xl leading-6 font-bold text-gray-400`}>
      {out.map(([seg, url], i) => {
        if (isCode) {
          url += "?code";
        }
        return (
          <Fragment key={i}>
            {i !== 0 && "/"}
            {i === (segments.length - 1)
              ? <span class={tw`text-default`}>{seg}</span>
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
    <>
      <VersionSelect
        versions={Object.fromEntries(
          versions.map((ver) => [ver, getModulePath(name, ver, path)]),
        )}
        selectedVersion={selectedVersion}
      />
      {versions[0] !== selectedVersion && (
        <a
          class={tw`py-2.5 px-4.5 text-white bg-tag-blue hover:bg-blue-500 rounded-md leading-none`}
          aria-label="Go to latest version"
          href={getModulePath(name, versions[0], path)}
        >
          Go to Latest
        </a>
      )}
    </>
  );
}

export const handler: Handlers<MaybeData> = {
  async GET(req, { params, render }) {
    const { name, version, path } = params as Params;
    const url = new URL(req.url);
    const isHTML = accepts(req, "application/*", "text/html") === "text/html";

    if (name === "std" && url.pathname.startsWith("/x")) {
      url.pathname = url.pathname.slice(2);
      return Response.redirect(url, 301);
    }

    const isCode = url.searchParams.has("code");

    const symbol = url.searchParams.get("s");
    const resURL = new URL(
      `https://apiland.deno.dev/v2/pages/${isCode ? "code" : "doc"}/${name}/${
        version || "__latest__"
      }/${path}`,
    );
    if (symbol && !isCode) {
      resURL.searchParams.set("symbol", symbol);
    }

    let data: Data;

    const res = await fetch(resURL, {
      redirect: "manual",
    });
    if (res.status === 404) { // module doesnt exist
      if (isHTML) {
        return render(null);
      } else {
        return new Response(`The module '${name}' does not exist`, {
          status: 404,
        });
      }
    } else if (res.status === 302) { // implicit latest
      const latestVersion = res.headers.get("X-Deno-Latest-Version")!;
      return new Response(undefined, {
        headers: {
          Location: getModulePath(
            name,
            latestVersion,
            path ? ("/" + path) : undefined,
          ),
          "x-deno-warning":
            `Implicitly using latest version (${latestVersion}) for ${url.href}`,
          "Access-Control-Allow-Origin": "*",
        },
        status: 302,
      });
    } else if (res.status === 301) { // path is directory and there is an index module and its doc
      const newPath = res.headers.get("X-Deno-Module-Path")!;
      return new Response(undefined, {
        headers: {
          Location: getModulePath(
            name,
            version,
            newPath,
          ),
        },
        status: 301,
      });
    } else {
      data = { data: await res.json(), isCode };
    }

    if (!data.data.latest_version) {
      if (isHTML) {
        return render!(data);
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

    if (!isHTML) {
      const remoteUrl = `${S3_BUCKET}${name}/versions/${version}/raw/${path}`;
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

    const ln = extractAltLineNumberReference(url.pathname);
    if (ln) {
      url.pathname = ln.rest;
      url.searchParams.set("code", "");
      url.hash = "L" + ln.line;
      return Response.redirect(url, 302);
    }

    if (data.data.kind === "index" || data.data.kind === "dir") {
      data.data.readme = await getReadme(
        name,
        version,
        data.data.kind === "index" ? data.data.items : data.data.entries,
        data.data.upload_options,
      );
    } else if (data.isCode && data.data.kind === "file") {
      data.data.file = await getRawFile(
        name,
        version,
        path ? `/${path}` : "",
      );
    }

    return render!(data);
  },
};

export const config: RouteConfig = {
  routeOverride: "/x/:name{@:version}?/:path*",
};
