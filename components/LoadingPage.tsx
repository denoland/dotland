import React from "react";
import Head from "next/head";
import MetaDescription from "./MetaDescription";

function LoadingPage() {
  return (
    <div>
      <Head>
        <title>Deno</title>
        <MetaDescription
          labels={{
            title: "Deno",
            description:
              "Deno, a secure runtime for JavaScript and TypeScript.",
            image: "/v1_wide.jpg",
          }}
        />
      </Head>
      <div className="bg-gray-50 min-h-full"></div>
    </div>
  );
}

export default LoadingPage;
