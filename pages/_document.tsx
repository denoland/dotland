// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

export default class DenoDocDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="stylesheet" href="/fonts/inter/inter.css" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/icons/apple-touch-icon-180x180.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Deno" />
          <meta property="og:url" content="https://deno.land" />
          <meta
            property="og:title"
            content="Deno - A secure runtime for JavaScript and TypeScript"
          />
          <meta
            property="og:description"
            content="Deno is a simple, modern and secure runtime for JavaScript and TypeScript that uses V8 and is built in Rust."
          />
          <meta property="og:image" content="https://deno.land/v1.png" />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
