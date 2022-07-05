import type { ModuleIndexWithDoc } from "$doc_components/module_index.tsx";
import type { DocNode } from "$deno_doc/types.d.ts";
import { getIndex } from "$doc_components/doc.ts";
import { dirname } from "$std/path/mod.ts";
import { fileTypeFromURL } from "./registry_utils.ts";
export type { DocNode };

const API_URL = "https://apiland.deno.dev/v2/modules/";
export interface Index {
  index: ModuleIndexWithDoc;
  indexModule: string | undefined;
  nodes: DocNode[];
}

export async function getDocs(
  name: string,
  version: string,
  path: string,
): Promise<[index: Index, docs: DocNode[] | null]> {
  const type = fileTypeFromURL(path);
  if (
    type === "javascript" || type === "typescript" ||
    type === "tsx" || type === "jsx"
  ) {
    return Promise.all([
      getModuleIndex(name, version, dirname(path)),
      getDocNodes(name, version, path),
    ]);
  } else { // TODO: check if it is a directory
    return [await getModuleIndex(name, version, path), null];
  }
}

export async function getModuleIndex(
  module: string,
  version: string,
  path: string,
): Promise<Index> {
  const response = await fetch(
    `${API_URL}${module}/${version}/index${path}`,
  );
  if (response.status !== 200) {
    throw new Error(`Unexpected result fetching module index.`);
  }
  const index = await response.json();
  console.log(index);
  const indexModule = getIndex(index.index[path || "/"]);
  if (indexModule) {
    return {
      index,
      indexModule,
      nodes: await getDocNodes(
        module,
        version,
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

export async function getEntries(
  module: string,
  version: string,
  modules: string[],
): Promise<Record<string, DocNode[]>> {
  const response = await fetch(
    `${API_URL}${module}/${version}/doc`,
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
    `${API_URL}${module}/${version}/doc${path}`,
  );
  if (response.status !== 200) {
    throw new Error(`Unexpected result fetching doc nodes.`);
  }
  return await response.json();
}
