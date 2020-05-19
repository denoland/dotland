import React from "react";
import Head from "next/head";

function LoadingPage() {
  return (
    <div>
      <Head>
        <title>Deno</title>
        <meta
          name="description"
          content="Deno, a secure runtime for JavaScript and TypeScript."
        />
      </Head>
      <div className="bg-gray-50 min-h-full"></div>
    </div>
  );
}

export default LoadingPage;
