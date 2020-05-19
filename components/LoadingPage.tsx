import React from "react";
import Head from "next/head";
import { metaDescription } from "../pages";

function LoadingPage() {
  return (
    <div>
      <Head>
        <title>Deno</title>
        {metaDescription({
          title: "Deno",
          description:
            "Deno is a simple, modern and secure runtime for JavaScript and TypeScript that uses V8 and is built in Rust.",
          image: "https://deno.land/v1_wide.jpg",
        })}
      </Head>
      <div className="bg-gray-50 min-h-full"></div>
    </div>
  );
}

export default LoadingPage;
