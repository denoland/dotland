// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "../deps.ts";
import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";
import { Translation, TRANSLATIONS } from "../util/translations_utils.ts";

export default function TranslationsPage() {
  return (
    <>
      <head>
        <title>Translations | Deno</title>
      </head>
      <Header />
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 mt-8 mb-24">
        <div class="max-w-screen-lg mx-auto">
          <h4 class="text-4xl font-bold tracking-tight">Translations</h4>
          <p class="mt-4 text-lg">
            Deno docs is available in the following languages. Do you have a
            piece to display here?{" "}
            <a
              href="https://github.com/denoland/dotland/blob/main/translations.json"
              class="link"
            >
              Add it!
            </a>
          </p>
        </div>
        <div class="my-16 flex flex-row flex-wrap gap-16 justify-evenly items-end">
          {TRANSLATIONS.map((language, i) => (
            <LanguageItem key={i} language={language} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

function LanguageItem({ language }: { language: Translation }) {
  return (
    <div class="p-2 mx-20 mb-5">
      <span class="text-gray-600 leading-tight flex justify-center">
        {language.english}
      </span>
      <div class="mt-3 text-xl font-semibold text-center">
        <a href={language.link} class="hover:text-gray-700 hover:underline">
          {language.language}
        </a>
      </div>
      <div class="flex justify-center mt-3">
        <a href={language.repository} class="text-gray-500 hover:text-gray-700">
          <span class="sr-only">GitHub</span>
          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
