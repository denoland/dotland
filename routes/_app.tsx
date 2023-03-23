// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <div class="h-screen">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="/fonts/inter/inter.css" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* needed for the dialog on safari to handle visibility of modal based on the `open` prop */}
        <link
          rel="stylesheet"
          href="https://esm.sh/dialog-polyfill@0.5.6/dialog-polyfill.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Lexend:wght@400;500&display=swap"
        />
        <link rel="stylesheet" href="/app.css" />
        <link rel="stylesheet" href="/gfm.css" />
      </Head>
      <Component />
    </div>
  );
}
