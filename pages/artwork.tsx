/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";

import Footer from "../components/Footer";
import Header from "../components/Header";
import { ARTWORKS, Artwork } from "../util/artwork_utils";

const ArtworkPage = () => {
  return (
    <>
      <Head>
        <title>Artwork | Deno</title>
      </Head>
      <Header />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 mt-8 mb-24">
        <div className="max-w-screen-lg mx-auto">
          <h4 className="text-4xl font-bold tracking-tight">Artwork</h4>
          <p className="mt-4 text-lg">
            A lot of artwork related to Deno has been created in the last few
            years. This page serves as place the art is collected and displayed.
            Do you have a piece to display here?{" "}
            <a
              href="https://github.com/denoland/deno_website2/blob/master/artwork.json"
              className="link"
            >
              Add it!
            </a>
          </p>
        </div>
        <div className="deno-artwork lg:flex-col">
          {ARTWORKS.map((artwork, i) => (
            <Item key={i} artwork={artwork} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

function Item({ artwork }: { artwork: Artwork }) {
  return (
    <div className="pt-16 deno-nobreakinside">
      <img
        src={artwork.image}
        alt={artwork.alt}
        className="w-full rounded-md"
      />
      <div className="mt-4 flex justify-between items-center">
        <div className="flex justify-start items-center">
          <img
            src={artwork.artist.profile_image}
            alt={artwork.artist.name}
            className="rounded-full w-12 h-12"
          />
          <div className="ml-4 flex flex-col justify-center">
            <div className="text-xl leading-tight">{artwork.artist.name}</div>
            <a
              className="text-gray-600 hover:text-gray-800 leading-tight"
              href={artwork.license.link}
            >
              {artwork.license.name}
            </a>
          </div>
        </div>
        <div className="flex justify-start items-center">
          {artwork.artist.web && (
            <a
              href={artwork.artist.web}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Website</span>
              <svg
                className="h-6 w-6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>{" "}
              </svg>
            </a>
          )}
          {artwork.artist.twitter && (
            <a
              href={`https://twitter.com/${artwork.artist.twitter}`}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          )}
          {artwork.artist.github && (
            <a
              href={`https://github.com/${artwork.artist.github}`}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtworkPage;
