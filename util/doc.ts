import { IndexStructure, SerializeMap } from "doc_components/doc.ts";
import type { DocNode } from "https://deno.land/x/deno_doc@v0.34.0/lib/types.d.ts";
export type { DocNode };
let innerIndexStructure: IndexStructure;

export async function getIndexStructure(): Promise<IndexStructure> {
  if (innerIndexStructure) {
    return innerIndexStructure;
  }
  const data = await fetch(
    "https://raw.githubusercontent.com/denoland/doc_components/3736d1be4ba344e0b70385cc0ae1d5d225e28989/_showcase/data/index_structure.json",
  ).then((res) => res.text());
  return innerIndexStructure = JSON.parse(
    data,
    (key, value) =>
      typeof value === "object" && (key === "structure" || key === "entries")
        ? new SerializeMap(Object.entries(value))
        : value,
  );
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
