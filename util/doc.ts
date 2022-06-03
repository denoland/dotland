import {
  IndexStructure,
  SerializeMap,
} from "https://raw.githubusercontent.com/denoland/doc_components/59572f532b67ee61631a7921becc49c67433fa20/doc.ts";

let innerIndexStructure: IndexStructure;

export async function getIndexStructure(): Promise<IndexStructure> {
  if (innerIndexStructure) {
    return innerIndexStructure;
  }
  const data = await fetch(
    "https://raw.githubusercontent.com/denoland/doc_components/59572f532b67ee61631a7921becc49c67433fa20/_showcase/data/index_structure.json",
  ).then((res) => res.text());
  return innerIndexStructure = JSON.parse(
    data,
    (key, value) =>
      typeof value === "object" && (key === "structure" || key === "entries")
        ? new SerializeMap(Object.entries(value))
        : value,
  );
}
