/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";

import Footer from "../components/Footer";
import Header from "../components/Header";
import { ARTWORKS, Artwork } from "../util/artwork_utils";
import { CookieBanner } from "../components/CookieBanner";

const ArtworkPage = () => {
  return (
    <>
      <Head>
        <title>Artwork | Deno</title>
      </Head>
      <CookieBanner />
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
        <div className="my-16 flex flex-row flex-wrap gap-16 justify-evenly items-end">
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
    <div className="p-2 mx-1 mb-5">
      <div className="flex justify-center">
        <img
          src={artwork.image}
          alt={artwork.alt}
          className="rounded-md max-h-56"
        />
      </div>
      <div className="mt-3 text-xl font-semibold text-center">
        {artwork.link ? (
          <a
            href={artwork.link}
            className="hover:text-gray-700 hover:underline"
          >
            {artwork.title}
          </a>
        ) : (
          artwork.title
        )}
      </div>
      <div className="mt-3 flex justify-between items-center">
        <div className="flex justify-start items-center">
          {artwork.artist.profile_image ? (
            <img
              src={artwork.artist.profile_image}
              alt={artwork.artist.name}
              className="rounded-full w-12 h-12"
            />
          ) : (
            <div className="rounded-full w-12 h-12 bg-gray-200" />
          )}
          <div className="ml-4 flex flex-col justify-center">
            <div className="text-xl leading-tight">{artwork.artist.name}</div>
            <span className="text-gray-600 leading-tight">
              {artwork.license}
            </span>
          </div>
        </div>
        <div className="flex justify-start items-center ml-4">
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
          {artwork.artist.instagram && (
            <a
              href={`https://www.instagram.com/${artwork.artist.instagram}`}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtworkPage;
