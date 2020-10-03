/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";

function LoadingPage() {
  return (
    <div>
      <Head>
        <title>Deno</title>
      </Head>
      <div className="bg-gray-50 min-h-full"></div>
    </div>
  );
}

export default LoadingPage;
