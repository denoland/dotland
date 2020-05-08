const basepath = "https://raw.githubusercontent.com/denoland/deno/";

export interface TableOfContents {
  [slug: string]: {
    name: string;
    children?: {
      [slug: string]: string;
    };
  };
}

export async function getTableOfContents(
  version: string
): Promise<TableOfContents> {
  const res = await fetch(`${basepath}${version}/docs/toc.json`);
  if (res.status !== 200) {
    throw Error(
      `Got an error (${
        res.status
      }) while getting the manual table of contents:\n${await res.text()}`
    );
  }
  return await res.json();
}

export async function getFile(version: string, path: string): Promise<string> {
  const res = await fetch(`${basepath}${version}/docs/${path}.md`);
  if (res.status !== 200) {
    throw Error(
      `Got an error (${
        res.status
      }) while getting the file of contents:\n${await res.text()}`
    );
  }
  return await res.text();
}
