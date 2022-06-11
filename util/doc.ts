import type { ModuleIndexWithDoc } from "$doc_components/module_index.tsx";
import type { DocNode } from "https://deno.land/x/deno_doc@v0.34.0/lib/types.d.ts";
import { getIndex } from "$doc_components/doc.ts";
import { fileTypeFromURL } from "./registry_utils.ts";
export type { DocNode };

export interface Index {
  index: ModuleIndexWithDoc;
  indexModule: string | undefined;
  nodes: DocNode[];
}

export async function getDocs(
  name: string,
  version: string,
  path: string,
): Promise<DocNode[] | Index> {
  const type = fileTypeFromURL(path);
  if (
    type === "javascript" || type === "typescript" ||
    type === "tsx" || type === "jsx"
  ) {
    return getDocNodes(name, version, path);
  } else { // TODO: check if it is a directory
    const index = await getModuleIndex(name, version, path);
    const indexModule = getIndex(index.index[path || "/"]);
    if (indexModule) {
      return {
        index,
        indexModule,
        nodes: await getDocNodes(
          params.name,
          version!,
          indexModule,
        ),
      };
    } else {
      return {
        index,
        indexModule: undefined,
        nodes: [],
      };
    }
  }
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
