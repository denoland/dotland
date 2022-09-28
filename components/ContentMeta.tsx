// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
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
  "generic": "https://deno.land/og-image.png",
  "manual": "https://deno.land/og-manual.png",
  "api": "https://deno.land/og-api.png",
  "std": "https://deno.land/og-std.png",
  "modules": "https://deno.land/og-modules.png",
};
type OgImageType = keyof typeof OgImagePath;

/** A component which provides a unified way of setting the header meta data
 * in a structured way. */
export function ContentMeta(
  {
    title = DEFAULT_TITLE,
    description,
    creator,
    keywords = DEFAULT_KEYWORDS,
    ogType = "website",
    ogImage = "generic",
    noIndex = false,
    noAppendTitle = false,
  }: {
    title: string;
    description?: string;
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
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site:id" content="@deno_land" />

      <title>{title}</title>
      <meta name="twitter:title" content={title} />
      <meta property="og:title" content={title} />

      {creator && <meta name="twitter:creator:id" content={creator} />}

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Deno" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={OgImagePath[ogImage]} />

      <meta name="robots" content={noIndex ? "noindex" : "index, follow"} />
      <meta name="keywords" content={keywords.join(", ")} />

      {description && (
        <>
          <meta name="twitter:description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="description" content={description} />
        </>
      )}
    </Head>
  );
}
