// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { type DocNode } from "../deps.ts";
import { type ModuleIndexWithDoc } from "../module_index.tsx";

export async function getDocNodes(
  module: string,
  version: string,
  path: string,
): Promise<DocNode[]> {
  const response = await fetch(
    `https://apiland.deno.dev/v2/modules/${module}/${version}/doc${path}`,
  );
  if (response.status !== 200) {
    console.error(response);
    throw new Error(`Unexpected result fetching doc nodes.`);
  }
  return response.json();
}

export async function getEntries(
  module: string,
  version: string,
  modules: string[],
): Promise<Record<string, DocNode[]>> {
  const response = await fetch(
    `https://apiland.deno.dev/v2/modules/${module}/${version}/doc`,
    {
      method: "POST",
      body: JSON.stringify(modules),
      headers: {
        "content-type": "application/json",
      },
    },
  );
  if (response.status !== 200) {
    console.error(response);
    throw new Error(`Unexpected result fetching doc nodes.`);
  }
  return response.json();
}

export async function getModuleIndex(
  module: string,
  version: string,
  path = "/",
): Promise<ModuleIndexWithDoc> {
  const response = await fetch(
    `https://apiland.deno.dev/v2/modules/${module}/${version}/index${path}`,
  );
  if (response.status !== 200) {
    console.error(response);
    throw new Error(`Unexpected result fetching module index.`);
  }
  return response.json();
}
