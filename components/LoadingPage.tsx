import React from "react";
import Head from "next/head";

function LoadingPage() {
  return (
    <div>
      <Head>
        <title>Deno</title>
        <meta name="title" content="Deno" />
        <meta
          name="description"
          content="Deno, a secure runtime for JavaScript and TypeScript."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://deno.land" />
        <meta name="twitter:title" content="Deno" />
        <meta
          name="twitter:description"
          content="Deno, a secure runtime for JavaScript and TypeScript."
        />
        <meta name="twitter:image" content="https://deno.land/v1_wide.jpg" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://deno.land" />
        <meta property="og:title" content="Deno" />
        <meta
          property="og:description"
          content="Deno, a secure runtime for JavaScript and TypeScript."
        />
        <meta property="og:image" content="https://deno.land/v1_wide.jpg" />
      </Head>
      <div className="bg-gray-50 min-h-full"></div>
    </div>
  );
}

export default LoadingPage;
