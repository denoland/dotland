// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import App from "next/app";
import Head from "next/head";
import "../components/app.css";
import "../components/markdown.css";

export default class DenoWebsiteApp extends App {
  render() {
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
