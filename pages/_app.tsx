// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import App from "next/app";
import Head from "next/head";
import "../components/app.css";
import "../components/markdown.css";
import "../components/docsearch.css";

export default class DenoWebsiteApp extends App {
  render(): React.ReactElement {
    const { Component, pageProps } = this.props;
    return (
      <div className="h-screen">
        <Head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </Head>
        <Component {...pageProps} />
      </div>
    );
  }
}
