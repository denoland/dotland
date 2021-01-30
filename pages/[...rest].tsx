/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useMemo } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Registry from "../components/Registry";
import { parseNameVersion } from "../util/registry_utils";
import Manual from "../components/Manual";
import LoadingPage from "../components/LoadingPage";
import NotFoundPage from "../components/NotFound";

function RestPage(): React.ReactElement {
  const { query } = useRouter();
  const { name } = useMemo(() => {
    const [identifier] = (query.rest as string[]) ?? [];
    const [name] = parseNameVersion(identifier ?? "");
    return { name };
  }, [query]);

  if (name === "std") return <Registry />;
  if (name === "manual") return <Manual />;

  if (name === "") return <LoadingPage />;

  return <NotFoundPage />;
}

const restPagePaths = ["/std", "/manual"];
const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const url = req.url ?? "";
  const isUrlFound = restPagePaths.some((whitelistedPath) =>
    url.startsWith(whitelistedPath)
  );
  if (!isUrlFound) {
    res.statusCode = 404;
  }
  return { props: {} };
};

export { getServerSideProps };
export default RestPage;
