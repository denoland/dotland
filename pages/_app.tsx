// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, Head } from "../deps.ts";

export default function App({ Component }) {
  return (
    <div class="h-screen">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />

        <meta name="twitter:site" content="@deno_land" />
        <meta name="twitter:creator" content="@deno_land" />
        <meta
          name="twitter:title"
          content="Deno - A modern runtime for JavaScript and TypeScript"
        />
        <meta
          name="twitter:description"
          content="Deno is a simple, modern runtime for JavaScript and
            TypeScript that uses V8 and is built in Rust."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="DenoLand" />
        <meta
          property="og:title"
          content="Deno - A modern runtime for JavaScript and TypeScript"
        />
        <meta
          property="og:description"
          content="Deno is a simple, modern runtime for JavaScript and
            TypeScript that uses V8 and is built in Rust."
        />
        <meta property="og:image" content="/v1_wide.jpg" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="Deno, DenoLand, Development, JavaScript, TypeScript"
        />
        <link rel="stylesheet" href="/fonts/inter/inter.css" />
        <link rel="manifest" href="/site.webmanifest" />

        <link rel="stylesheet" href="/app.css" />
        <link rel="stylesheet" href="/gfm.css" />
      </Head>
      <Component />
    </div>
  );
}
