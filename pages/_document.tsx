// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

export default class DenoDocDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): React.ReactElement {
    return (
      <Html lang="ckb">
        <Head>
          <meta name="twitter:site" content="@deno_land" />
          <meta name="twitter:creator" content="@deno_land" />
          <meta
            name="twitter:title"
            content="دێنۆ - ژینگەیەکی مۆدێرن بۆ تایپسکریپت و جاڤاسکریپت"
          />
          <meta
            name="twitter:description"
            content="دێنۆ ژینگەیەکی مۆدێرن و پارێزراوە بۆ تایپسکریپت و جاڤاسکریپت کە V8 بەکار دەهێنێت و بە زمانی ڕەست نووسراوە."
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:site_name" content="DenoLand" />
          <meta
            property="og:title"
            content="دێنۆ - ژینگەیەکی مۆدێرن بۆ تایپسکریپت و جاڤاسکریپت"
          />
          <meta
            property="og:description"
            content="دێنۆ ژینگەیەکی مۆدێرن و پارێزراوە بۆ تایپسکریپت و جاڤاسکریپت کە V8 بەکار دەهێنێت و بە زمانی ڕەست نووسراوە."
          />
          <meta property="og:image" content="/images/icons/icon-512x512.png" />
          <meta property="og:type" content="website" />
          <meta name="robots" content="index, follow" />
          <meta
            name="keywords"
            content="Deno, DenoLand, Development, JavaScript, TypeScript"
          />
          <link rel="stylesheet" href="/fonts/inter/inter.css" />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
