/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";

import { GetStaticProps, GetStaticPaths } from "next";
import RegistryV2 from "../../components/RegistryV2";
import {
  getMeta,
  getVersionList,
  getDirectoryListing,
  getSourceURL,
  MetaInfo,
  VersionInfo,
  DirEntry,
} from "../../util/registry_utils";

interface RegistryPageProps {
  name: string;
  version: string;
  path: string;
  sourceURL: string;
  meta: MetaInfo | null;
  versionList: VersionInfo | null;
  dirEntries: DirEntry[] | null;
  raw: string | null;
}
const RegistryPage = (props: RegistryPageProps) => {
  return <RegistryV2 {...props} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<RegistryPageProps> = async (
  ctx
) => {
  const [identifier, ...pathParts] = ctx.params?.rest as string[];
  const path = pathParts.length === 0 ? "" : `/${pathParts.join("/")}`;
  const [name, version] = identifier.split("@");

  const metaPromise = getMeta(name);
  const versionListPromise = getVersionList(name);
  const sourceURL = getSourceURL(name, version, path);

  if (!version) {
    return {
      props: {
        name,
        version: version ?? "",
        path: path ?? "",
        sourceURL,
        meta: await metaPromise,
        versionList: await versionListPromise,
        dirEntries: null,
        raw: null,
      },
      // eslint-disable-next-line @typescript-eslint/camelcase
      unstable_revalidate: 1,
    };
  }

  const [meta, versionList, directoryListing, raw] = await Promise.all([
    metaPromise,
    versionListPromise,
    getDirectoryListing(name, version),
    fetch(sourceURL, { method: "GET" }).then((resp) => {
      if (!resp.ok) {
        if (resp.status === 400 || resp.status === 403 || resp.status === 404)
          return null;
        throw new Error(`${resp.status}: ${resp.statusText}`);
      }
      return resp.text();
    }),
  ]);

  let dirEntries: DirEntry[] | null = null;
  if (Array.isArray(directoryListing)) {
    const files = directoryListing
      .filter(
        (f) =>
          f.path.startsWith(path) &&
          f.path.split("/").length - 2 === path.split("/").length - 1
      )
      .map<DirEntry>((f) => {
        const [name] = f.path.slice(path.length + 1).split("/");
        return {
          name,
          type: f.type,
        };
      });
    dirEntries = files.length > 0 ? files : null;
  }

  return {
    props: {
      name,
      version: version ?? "",
      path: path ?? "",
      sourceURL,
      meta,
      versionList,
      dirEntries,
      raw,
    },
    // eslint-disable-next-line @typescript-eslint/camelcase
    unstable_revalidate: versionList?.versions.includes(version) ? 3600 : 1,
  };
};

export default RegistryPage;
