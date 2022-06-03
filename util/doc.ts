import { IndexStructure, SerializeMap } from "doc_components/doc.ts";

let innerIndexStructure: IndexStructure;

export async function getIndexStructure(): Promise<IndexStructure> {
  if (innerIndexStructure) {
    return innerIndexStructure;
  }
  const data = await fetch(
    "https://raw.githubusercontent.com/denoland/doc_components/b838d8f3b47fccd33dfd725a5e831616cf0c0092/_showcase/data/index_structure.json",
  ).then((res) => res.text());
  return innerIndexStructure = JSON.parse(
    data,
    (key, value) =>
      typeof value === "object" && (key === "structure" || key === "entries")
        ? new SerializeMap(Object.entries(value))
        : value,
  );
}
