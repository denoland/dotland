import type { ModuleIndexWithDoc } from "$doc_components/module_path_index.tsx";
import type { DocNode } from "$deno_doc/types.d.ts";
import { getIndex } from "$doc_components/doc.ts";
import { dirname } from "$std/path/mod.ts";
import { fileTypeFromURL, filetypeIsJS } from "./registry_utils.ts";
export type { DocNode };

const API_URL = "https://apiland.deno.dev/v2/modules/";
export interface Index {
  index: ModuleIndexWithDoc;
  indexModule: string | undefined;
  nodes: DocNode[];
}

export interface Doc {
  index: Index;
  doc: DocNode[] | null;
  symbol?: string;
}

export async function getDocs(
  name: string,
  version: string,
  path: string,
): Promise<Doc> {
  const type = fileTypeFromURL(path);
  if (filetypeIsJS(type)) {
    const [index, doc] = await Promise.all([
      getModuleIndex(name, version, dirname(path)),
      getDocNodes(name, version, path),
    ]);
    return {
      index,
      doc,
    };
  } else { // TODO: check if it is a directory
    return {
      index: await getModuleIndex(name, version, path),
      doc: null,
    };
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
