/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Markdown from "../components/Markdown";
import { GetStaticProps } from "next";
import { promises as fs } from "fs";
import Link from "next/link";

interface Props {
  markdown: string;
}

const V1 = (props: Props) => {
  return (
    <>
      <Head>
        <title>Deno 1.0</title>
        <meta
          name="description"
          content="Deno, a secure runtime for JavaScript and TypeScript."
        />
      </Head>
      <Header />
      <div className="w-full" style={{ backgroundColor: "#2f2e2c" }}>
        <div className="max-w-screen-lg mx-auto">
          <img
            src="/v1_wide.jpg"
            alt=""
            className="w-full h-auto hidden md:block"
            width="2000"
            height="1024"
          />
          <img
            src="/v1.jpg"
            alt=""
            width="1366"
            height="1024"
            className="w-full h-auto block md:hidden"
          />
        </div>
      </div>
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 py-8 mb-16">
        <h1 className="text-3xl tracking-tight font-bold text-5xl leading-10 mt-4 py-8">
          Deno 1.0
        </h1>
        <p className="text-gray-500 mt-3 leading-tight">2020-05-13</p>
        <p className="text-gray-500 mt-3 leading-tight">
          Ryan Dahl, Bert Belder, and Bartek Iwańczuk
        </p>
        <div className="mt-8">
          <Markdown
            source={props.markdown}
            canonicalURL={"https://deno.land/v1.md"}
          />
        </div>
        <div className="py-32 text-gray-900">
          <h2 className="text-2xl tracking-tight leading-tight font-bold border-b border-gray-200 mt-12 mb-6 pb-1">
            One last thing
          </h2>
          <p>
            Consider supporting this open source software work by pre-ordering a
            Deno v1.0 hoodie:
          </p>
          <img
            src="/v1_hoodie_mock.png"
            alt="deno 1.0 hoodie"
            className="mx-auto py-8 max-w-sm w-full"
          />
          <span className="block rounded-md shadow-sm">
            <Link href="/v1/hoodie">
              <a className="flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:shadow-outline-indigo active:bg-gray-700 transition duration-150 ease-in-out">
                Order here &rarr;
              </a>
            </Link>
          </span>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const markdown = await fs.readFile("./public/v1.md", { encoding: "utf8" });

  return {
    props: {
      markdown,
    },
  };
};

export default V1;
