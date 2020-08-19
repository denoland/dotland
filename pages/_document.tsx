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

  gtag_header = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-P9DQ4WJ');`;
  gtag_body = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P9DQ4WJ"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`;

  render() {
    return (
      // <Html lang="en">
      <Html lang="ja">
        <Head>
          <link rel="stylesheet" href="/fonts/inter/inter.css" />
          <link
            href="https://fonts.googleapis.com/css?family=Noto+Sans+JP"
            rel="stylesheet"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/icons/apple-touch-icon-180x180.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          {/* <!-- Google Tag Manager --> */}
          <script dangerouslySetInnerHTML={{ __html: this.gtag_header }} />
          {/* <!-- End Google Tag Manager --> */}
        </Head>
        <body>
          {/* <!-- Google Tag Manager (noscript) --> */}
          <noscript dangerouslySetInnerHTML={{ __html: this.gtag_body }} />
          {/* <!-- End Google Tag Manager (noscript) --> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
