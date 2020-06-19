/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import json from "../artwork.json";

const ARTWORK_JSON: {
  artworks: Array<{
    image: string;
    alt: string;
    artist: string;
    license: string;
  }>;
  artists: { [id: string]: Artist };
  licenses: { [id: string]: License };
} = json;

export interface Artwork {
  image: string;
  alt: string;
  artist: Artist;
  license: License;
}

export interface Artist {
  name: string;
  profile_image: string;
  twitter?: string;
  github?: string;
  web?: string;
}

export interface License {
  name: string;
  link: string;
}

export const ARTWORKS = ARTWORK_JSON.artworks.map((artwork) => ({
  image: artwork.image,
  alt: artwork.alt,
  artist: ARTWORK_JSON.artists[artwork.artist],
  license: ARTWORK_JSON.licenses[artwork.license],
}));
