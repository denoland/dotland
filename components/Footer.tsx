/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Link from "next/link";

const Footer = (props: { simple?: boolean }) => (
  <div
    className={props.simple ? undefined : "bg-gray-50 border-t border-gray-200"}
  >
    <div className="max-w-screen-xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
      <nav className="-mx-5 -my-2 flex flex-wrap justify-center">
        <div className="px-5 py-2">
          <a
            href="https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts"
            className="text-base leading-6 text-gray-500 hover:text-gray-900"
          >
            Runtime Documentation
          </a>
        </div>
        <div className="px-5 py-2">
          <Link href="/[identifier]" as="/std">
            <a className="text-base leading-6 text-gray-500 hover:text-gray-900">
              Standard Library
            </a>
          </Link>
        </div>
        <div className="px-5 py-2">
          <Link href="/x">
            <a className="text-base leading-6 text-gray-500 hover:text-gray-900">
              Third Party Modules
            </a>
          </Link>
        </div>
        <div className="px-5 py-2">
          <Link href="/benchmarks">
            <a className="text-base leading-6 text-gray-500 hover:text-gray-900">
              Benchmarks
            </a>
          </Link>
        </div>
      </nav>
      <div className="mt-9 flex justify-center">
        <a
          href="https://github.com/denoland"
          className="text-gray-400 hover:text-gray-500"
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
        <a
          href="https://discord.gg/TGMHGv6"
          className="ml-6 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Discord</span>
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.222 0c1.406 0 2.54 1.137 2.607 2.475V24l-2.677-2.273-1.47-1.338-1.604-1.398.67 2.205H3.71c-1.402 0-2.54-1.065-2.54-2.476V2.48C1.17 1.142 2.31.003 3.715.003h16.5L20.222 0zm-6.118 5.683h-.03l-.202.2c2.073.6 3.076 1.537 3.076 1.537-1.336-.668-2.54-1.002-3.744-1.137-.87-.135-1.74-.064-2.475 0h-.2c-.47 0-1.47.2-2.81.735-.467.203-.735.336-.735.336s1.002-1.002 3.21-1.537l-.135-.135s-1.672-.064-3.477 1.27c0 0-1.805 3.144-1.805 7.02 0 0 1 1.74 3.743 1.806 0 0 .4-.533.805-1.002-1.54-.468-2.14-1.404-2.14-1.404s.134.066.335.2h.06c.03 0 .044.015.06.03v.006c.016.016.03.03.06.03.33.136.66.27.93.4a8.18 8.18 0 001.8.536c.93.135 1.996.2 3.21 0 .6-.135 1.2-.267 1.8-.535.39-.2.87-.4 1.397-.737 0 0-.6.936-2.205 1.404.33.466.795 1 .795 1 2.744-.06 3.81-1.8 3.87-1.726 0-3.87-1.815-7.02-1.815-7.02-1.635-1.214-3.165-1.26-3.435-1.26l.056-.02zm.168 4.413c.703 0 1.27.6 1.27 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.334.002-.74.573-1.338 1.27-1.338zm-4.543 0c.7 0 1.266.6 1.266 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.334 0-.74.57-1.338 1.27-1.338z" />{" "}
          </svg>
        </a>
        <a
          href="https://twitter.com/deno_land"
          className="ml-6 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Twitter</span>
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        </a>
      </div>
      <div className="mt-8">
        <p className="text-center text-base leading-6 text-gray-400">
          &copy; {new Date().getFullYear()} the Deno authors. All rights
          reserved. MIT license.
        </p>
      </div>
      <div className="mt-6 flex justify-center flex-wrap">
        <a href="https://github.com/denoland/deno">
          <img
            className="m-2 opacity-75"
            alt="denoland/deno CI"
            src="https://img.shields.io/github/workflow/status/denoland/deno/ci/master?label=deno&logo=github"
          />
        </a>
        <a href="https://github.com/denoland/rusty_v8">
          <img
            className="m-2 opacity-75"
            alt="denoland/rusty_v8 CI"
            src="https://img.shields.io/github/workflow/status/denoland/rusty_v8/ci/master?label=rusty_v8&logo=github"
          />
        </a>
        <a href="https://github.com/denoland/deno_website2">
          <img
            className="m-2 opacity-75"
            alt="denoland/deno_website2 CI"
            src="https://img.shields.io/github/workflow/status/denoland/deno_website2/ci/master?label=deno_website2&logo=github"
          />
        </a>
        <a href="https://github.com/denoland/doc_website">
          <img
            className="m-2 opacity-75"
            alt="denoland/doc_website CI"
            src="https://img.shields.io/github/workflow/status/denoland/doc_website/ci/master?label=doc_website&logo=github"
          />
        </a>
        <a href="https://github.com/denoland/deno_install">
          <img
            className="m-2 opacity-75"
            alt="denoland/deno_install CI"
            src="https://img.shields.io/github/workflow/status/denoland/deno_install/ci/master?label=deno_install&logo=github"
          />
        </a>
      </div>
    </div>
  </div>
);

export default Footer;
