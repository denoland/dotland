/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Markdown from "../components/Markdown";
import { GetStaticProps } from "next";
import { promises as fs } from "fs";

interface Props {
  markdown: string;
}

const V1 = (props: Props) => {
  return (
    <>
      <Head>
        <title>1.0 | Deno</title>
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
            displayURL="https://deno.land/v1"
            sourceURL="https://deno.land/v1.md"
          />
        </div>
        <div className="py-8 text-gray-900">
          <a
            href="https://news.ycombinator.com/item?id=23172483"
            className="link"
          >
            HN Comments
          </a>
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
