/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Markdown from "../../components/Markdown";
import { GetStaticProps, GetStaticPaths } from "next";
import { promises as fs } from "fs";
import { join } from "path";
import Link from "next/link";
import { CookieBanner } from "../../components/CookieBanner";

const postPath =
  "https://github.com/denoland/deno_website2/blob/master/public/posts/";

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

function NewsPostPage(props: Props): React.ReactElement {
  const { query } = useRouter();
  const path = useMemo(() => {
    return query.post;
  }, [query]);
  const date = new Date(props.meta.publish_date);
  const format = new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <>
      <Head>
        <title>{props.meta.title}</title>
        <meta name="title" content={props.meta.title} />
        <meta name="description" content={props.meta.snippet} />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://deno.land/posts/${props.meta.id}`}
        />
        <meta property="og:title" content={props.meta.title} />
        <meta property="og:description" content={props.meta.snippet} />
        {props.meta.images.length > 0 ? (
          <meta
            property="og:image"
            content={`https://deno.land${props.meta.images[0].image}`}
          />
        ) : null}

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`https://deno.land/posts/${props.meta.id}`}
        />
        <meta property="twitter:title" content={props.meta.title} />
        <meta property="twitter:description" content={props.meta.snippet} />
        {props.meta.images.length > 0 ? (
          <meta
            property="twitter:image"
            content={`https://deno.land${props.meta.images[0].image}`}
          />
        ) : null}
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
          <a className="link">&lt;- Other News</a>
        </Link>
        <h1 className="tracking-tight font-bold text-5xl leading-10 mt-4 py-8">
          {props.meta.title}
        </h1>
        <a
          href={`${postPath}${path}.md`}
          className={`text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out float-right mt-2`}
        >
          <span className="sr-only">GitHub</span>
          <svg
            className="h-6 w-6 inline"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Edit on GitHub</title>
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <p className="text-gray-500 mt-3 leading-tight">
          {format.format(date)}
        </p>
        <p className="text-gray-500 mt-3 leading-tight">{props.meta.author}</p>
        <div className="mt-8 -mx-4">
          <Markdown
            source={props.markdown}
            displayURL={`https://deno.land/posts/${props.meta.id}`}
            sourceURL={`https://deno.land/posts/${props.meta.id}.md`}
            baseURL={`https://deno.land`}
            className="markdown-posts"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

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
