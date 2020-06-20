/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import json from "../artwork.json";

export const ARTWORKS: Artwork[] = json.sort((a, b) =>
  a.date > b.date ? -1 : 1
);

export interface Artwork {
  date: string;
  image: string;
  title: string;
  link?: string;
  alt: string;
  artist: Artist;
  license: string;
}

export interface Artist {
  name: string;
  profile_image?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  web?: string;
}
