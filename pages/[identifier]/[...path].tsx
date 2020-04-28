/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useMemo } from "react";
import Registry from "../../components/Registry";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { parseNameVersion } from "../../util/registry_utils";

const RegistryPage = () => {
  const { query } = useRouter();
  const { name } = useMemo(() => {
    const path =
      (Array.isArray(query.path) ? query.path.join("/") : query.path) ?? "";
    const [name, version] = parseNameVersion(
      (Array.isArray(query.identifier)
        ? query.identifier[0]
        : query.identifier) ?? ""
    );
    return { name, version, path: path ? `/${path}` : "" };
  }, [query]);

  if (name !== "std") return <ErrorPage statusCode={404} />;

  return <Registry />;
};

export default RegistryPage;
