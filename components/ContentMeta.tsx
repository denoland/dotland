// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import { Head } from "$fresh/runtime.ts";

const DEFAULT_TITLE = "Deno";
const DEFAULT_KEYWORDS = [
  "deno",
  "denoland",
  "development",
  "javascript",
  "typescript",
  "wasm",
];

type OgType = "website" | "article";

const OgImagePath = {
  "generic": {
    img: "https://deno.land/og-image.png",
    alt: "A logo of a sauropod in the rain and the word Deno",
  },
  "manual": {
    img: "https://deno.land/og-manual.png",
    alt: "A logo of a sauropod reading a book and the title Deno Manual",
  },
  "api": {
    img: "https://deno.land/og-api.png",
    alt: "A logo of a sauropod reading a book and the title Deno API Reference",
  },
  "std": {
    img: "https://deno.land/og-std.png",
    alt:
      "A logo of a sauropod holding a stack of books and the title Deno Standard Library",
  },
  "modules": {
    img: "https://deno.land/og-modules.png",
    alt:
      "A logo of a sauropod looking at some blocks on a table and the title Deno Modules",
  },
};
type OgImageType = keyof typeof OgImagePath;

/** A component which provides a unified way of setting the header meta data
 * in a structured way. */
export function ContentMeta(
  {
    title = DEFAULT_TITLE,
    description,
    canonical,
    creator,
    keywords = DEFAULT_KEYWORDS,
    ogType = "website",
    ogImage = "generic",
    noIndex = false,
    noAppendTitle = false,
  }: {
    title: string;
    description?: string;
    canonical?: URL;
    creator?: string;
    keywords?: string[];
    ogType?: OgType;
    ogImage?: OgImageType;
    noIndex?: boolean;
    noAppendTitle?: boolean;
  },
) {
  if (!title.endsWith("| Deno") && !noAppendTitle) {
    title = `${title} | Deno`;
  }
  return (
    <Head>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@deno_land" />
      <link rel="me" href="https://fosstodon.org/@deno_land" />

      <title>{title}</title>
      <meta name="twitter:title" content={title} />
      <meta property="og:title" content={title} />

      {canonical && <link rel="canonical" href={canonical.toString()} />}

      {description && (
        <>
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
          <meta name="description" content={description} />
        </>
      )}

      {creator && <meta name="twitter:creator" content={creator} />}

      <meta name="twitter:image" content={OgImagePath[ogImage].img} />
      <meta name="twitter:image:alt" content={OgImagePath[ogImage].alt} />
      <meta property="og:image" content={OgImagePath[ogImage].img} />
      <meta property="og:image:alt" content={OgImagePath[ogImage].alt} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Deno" />
      <meta property="og:locale" content="en_US" />

      <meta name="robots" content={noIndex ? "noindex" : "index, follow"} />
      <meta name="keywords" content={keywords.join(", ")} />
    </Head>
  );
}
