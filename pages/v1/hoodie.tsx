/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { CookieBanner } from "../../components/CookieBanner";

function V1Hoodie(): React.ReactElement {
  return (
    <>
      <Head>
        <title>1.0 Hoodie | Deno</title>
      </Head>
      <CookieBanner />
      <Header />
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 py-8 mb-16">
        <h1 className="text-3xl tracking-tight font-bold text-5xl leading-10">
          Deno 1.0 Hoodie
        </h1>
        <p className="text-gray-500 mt-3 leading-tight">
          Limited Time, Premium Quality
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <div>
            <img src="/v1_hoodie_mock.png" alt="deno hoodie" />
          </div>
          <div>
            <p className="text-gray-900">
              Help support the Deno project by pre-ordering a limited time,
              special edition Deno v1.0 hoodie. This black zip-up hoodie
              features the v1.0 artwork by the famed Tokyo-based hacker/artist{" "}
              <a className="link" href="https://github.com/hashrock">
                hashrock
              </a>
              .
            </p>
            <p className="text-gray-900 mt-4">
              To be clear: this is a pre-order. We have not yet had these
              manufactured. The image above is a photoshopped mock-up. We will
              be taking orders until May 21st, after which this limited edition
              hoodie will never again be sold. We expect to ship these out in
              July.
            </p>
            <p className="text-gray-900 font-bold text-2xl leading-tight mt-4">
              $100
            </p>
            <p className="text-gray-500 mt-1 leading-tight">$15 shipping</p>
            <h1 className="py-8 text-3xl tracking-tight">Sold Out</h1>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default V1Hoodie;
