import type { ModuleIndexWithDoc } from "doc_components/module_index.tsx";
import type { DocNode } from "https://deno.land/x/deno_doc@v0.34.0/lib/types.d.ts";
export type { DocNode };

export async function getModuleIndex(
  module: string,
  version: string,
): Promise<ModuleIndexWithDoc> {
  const response = await fetch(
    `https://apiland.deno.dev/v2/modules/${module}/${version}/index/`,
  );
  if (response.status !== 200) {
    console.error(response);
    throw new Error(`Unexpected result fetching module index.`);
  }
  return await response.json();
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

