// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "@twind";
import { ContentMeta } from "@/components/ContentMeta.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Header } from "@/components/Header.tsx";
import * as Icons from "@/components/Icons.tsx";

import artworks from "@/data/artwork.json" assert { type: "json" };

const ARTWORKS: Artwork[] = artworks.sort((a, b) => a.date > b.date ? -1 : 1);

interface Artwork {
  date: string;
  image: string;
  title: string;
  link?: string;
  alt: string;
  artist: Artist;
  license: string;
}

interface Artist {
  name: string;
  profile_image?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  web?: string;
}

export default function ArtworkPage() {
  return (
    <>
      <ContentMeta
        title="Artwork"
        description="Community created Deno artwork and logos."
        keywords={["deno", "community", "artwork", "logo"]}
      />
      <Header />
      <div class={tw`section-x-inset-xl mt-8 mb-24`}>
        <div class={tw`max-w-screen-lg mx-auto`}>
          <h4 class={tw`text-4xl font-bold tracking-tight`}>Artwork</h4>

          <p class={tw`mt-4 text-lg`}>
            Do you have a piece to display here?{" "}
            <a
              href="https://github.com/denoland/dotland/blob/main/data/artwork.json"
              class={tw`link`}
            >
              Add it!
            </a>
          </p>
        </div>
        <div
          class={tw`my-16 flex flex-row flex-wrap gap-16 justify-evenly items-end`}
        >
          {ARTWORKS.map((artwork, i) => <Item key={i} artwork={artwork} />)}
        </div>
      </div>
      <Footer />
    </>
  );
}

function Item({ artwork }: { artwork: Artwork }) {
  return (
    <div class={tw`p-2 mx-1 mb-5`}>
      <div class={tw`flex justify-center`}>
        <img
          src={artwork.image}
          alt={artwork.alt}
          class={tw`rounded-md max-h-56`}
        />
      </div>
      <div class={tw`mt-3 text-xl font-semibold text-center`}>
        {artwork.link
          ? (
            <a
              href={artwork.link}
              class={tw`hover:text-gray-700 hover:underline`}
            >
              {artwork.title}
            </a>
          )
          : artwork.title}
      </div>
      <div class={tw`mt-3 flex justify-between items-center`}>
        <div class={tw`flex justify-start items-center`}>
          {artwork.artist.profile_image
            ? (
              <img
                src={artwork.artist.profile_image}
                alt={artwork.artist.name}
                class={tw`rounded-full w-12 h-12`}
              />
            )
            : <div class={tw`rounded-full w-12 h-12 bg-gray-200`} />}
          <div class={tw`ml-4 flex flex-col justify-center`}>
            <div class={tw`text-xl leading-tight`}>{artwork.artist.name}</div>
            <span class={tw`text-gray-600 leading-tight`}>
              {artwork.license}
            </span>
          </div>
        </div>
        <div
          class={tw`flex justify-start items-center ml-4 gap-2 children:children:(text-gray-500 hover:text-gray-700 h-5 w-auto)`}
        >
          {artwork.artist.web && (
            <a href={artwork.artist.web}>
              <span class={tw`sr-only`}>Website</span>
              <Icons.Globe />
            </a>
          )}
          {artwork.artist.twitter && (
            <a href={`https://twitter.com/${artwork.artist.twitter}`}>
              <span class={tw`sr-only`}>Twitter</span>
              <Icons.Twitter />
            </a>
          )}
          {artwork.artist.github && (
            <a href={`https://github.com/${artwork.artist.github}`}>
              <span class={tw`sr-only`}>GitHub</span>
              <Icons.GitHub />
            </a>
          )}
          {artwork.artist.instagram && (
            <a href={`https://www.instagram.com/${artwork.artist.instagram}`}>
              <span class={tw`sr-only`}>Instagram</span>
              <Icons.Instagram />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
