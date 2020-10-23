/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useMemo } from "react";
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

export default RestPage;
