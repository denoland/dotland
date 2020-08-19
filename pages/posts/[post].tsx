/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Markdown from "../../components/Markdown";
import { GetStaticProps, GetStaticPaths } from "next";
import { promises as fs } from "fs";
import { join } from "path";
import Link from "next/link";
import { CookieBanner } from "../../components/CookieBanner";

interface Props {
  markdown: string;
  meta: {
    id: string;
    title: string;
    author: string;
    publish_date: string;
    images: Array<{
      image: string;
      width: number;
      height: number;
      className: string;
      preview: boolean;
    }>;
    snippet: string;
  };
}

const NewsPostPage = (props: Props) => {
  const date = new Date(props.meta.publish_date);
  const format = new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <>
      <Head>
        <title>{props.meta.title} | Deno</title>
      </Head>
      <CookieBanner />
      <Header />
      <div className="w-full" style={{ backgroundColor: "#2f2e2c" }}>
        <div className="max-w-screen-lg mx-auto">
          {props.meta.images.map((image, i) => (
            <img
              key={i}
              src={image.image}
              alt=""
              className={`w-full h-auto ${image.className}`}
              width={image.width}
              height={image.height}
            />
          ))}
        </div>
      </div>
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 py-8 mb-16">
        <Link href="/posts">
          <a className="link">&lt;- Back to overview</a>
        </Link>

        <h1 className="tracking-tight font-bold text-5xl leading-10 mt-4 py-8">
          {props.meta.title}
        </h1>
        <p className="text-gray-500 mt-3 leading-tight">
          {format.format(date)}
        </p>
        <p className="text-gray-500 mt-3 leading-tight">{props.meta.author}</p>
        <div className="mt-8">
          <Markdown
            source={props.markdown}
            displayURL={`https://deno.land/posts/${props.meta.id}`}
            sourceURL={`https://deno.land/posts/${props.meta.id}.md`}
            baseURL={`https://deno.land`}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const dir = await fs.readdir("./public/posts");
  const postIds = dir.filter((name) => name.endsWith(".json"));
  const paths = postIds.map((id) => ({
    params: { post: id.replace(/\.json$/, "") },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const post = ctx.params!.post;
  const markdown = await fs.readFile(join("./public/posts", post + ".md"), {
    encoding: "utf8",
  });
  const meta = await fs.readFile(join("./public/posts", post + ".json"), {
    encoding: "utf8",
  });
  return {
    props: {
      markdown,
      meta: { ...JSON.parse(meta), id: post },
    },
  };
};

export default NewsPostPage;
