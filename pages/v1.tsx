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
        <title>Deno 1.0</title>
        <meta
          name="description"
          content="Deno, a secure runtime for JavaScript and TypeScript."
        />
      </Head>
      <Header />
      <div className="w-full" style={{ backgroundColor: "#2f2e2c" }}>
        <img
          src="/v1_wide.jpg"
          alt=""
          className="max-w-screen-lg mx-auto w-full hidden md:block"
        />
        <img
          src="/v1.jpg"
          alt=""
          className="max-w-screen-lg mx-auto w-full block md:hidden"
        />
      </div>
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 py-8">
        <h1 className="text-3xl tracking-tight font-bold text-5xl leading-10 mt-4">
          Deno 1.0
        </h1>
        <p className="text-gray-500 mt-3 leading-tight">
          May 13th 2020 – Ryan Dahl and Bert Belder
        </p>
        <p className="text-gray-500 mt-1 leading-tight"></p>
        <div className="mt-8">
          <Markdown source={props.markdown} />
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
