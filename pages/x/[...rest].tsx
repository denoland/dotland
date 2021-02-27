/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import { useRouter } from "next/router";
import Registry from "../../components/Registry";

function RegistryPage(): React.ReactElement {
  const router = useRouter();
  if (router.asPath.startsWith("/x/std")) {
    router.replace("/std");
  }

  return <Registry />;
}

export default RegistryPage;
