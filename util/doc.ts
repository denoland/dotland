import type { ModuleIndexWithDoc } from "$doc_components/module_index.tsx";
import type { DocNode } from "https://deno.land/x/deno_doc@v0.34.0/lib/types.d.ts";
export type { DocNode };

export interface Index {
  index: ModuleIndexWithDoc;
  entries: Record<string, DocNode[]>;
}

export async function getModuleIndex(
  module: string,
  version: string,
  path: string,
): Promise<ModuleIndexWithDoc> {
  const response = await fetch(
    `https://apiland.deno.dev/v2/modules/${module}/${version}/index${path}`,
  );
  if (response.status !== 200) {
    throw new Error(`Unexpected result fetching module index.`);
  }
  return await response.json();
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
    throw new Error(`Unexpected result fetching doc nodes.`);
  }
  return response.json();
}

export async function getDocNodes(
  module: string,
  version: string,
  path: string,
): Promise<DocNode[]> {
  const response = await fetch(
    `https://apiland.deno.dev/v2/modules/${module}/${version}/doc${path}`,
  );
  if (response.status !== 200) {
    throw new Error(`Unexpected result fetching doc nodes.`);
  }
  return await response.json();
}
