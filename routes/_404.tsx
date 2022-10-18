// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { ContentMeta } from "@/components/ContentMeta.tsx";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";

export default function NotFoundPage() {
  return (
    <div class="w-full min-h-screen overflow-x-hidden relative flex justify-between flex-col flex-wrap">
      <ContentMeta title="Not Found" />
      <div class="flex-top">
        <Header />
        <header class="text-center px-8 py-[10vh] z-[3]">
          <h1 class="font-extrabold text-5xl leading-10 tracking-tight text-gray-900">
            404
          </h1>
          <h2 class="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
            Couldn't find what you're looking for.
          </h2>
        </header>
      </div>
      <div class="flex-bottom">
        <div class="mt-auto w-full pointer-events-none h-[200px] relative overflow-hidden">
          <img
            src="/images/ferris.gif"
            alt="Ferris"
            class="translate-y-[22px] w-[100px] absolute left-[60%] bottom-0"
          />
          <img
            src="/images/deno404.gif"
            alt="Deno"
            class="translate-y-[24px] w-[200px] absolute left-[10%] animate-move"
          />
        </div>
        <Footer />
      </div>
    </div>
  );
}
