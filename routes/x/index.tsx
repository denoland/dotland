// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { ComponentProps, Fragment, h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { css, tw } from "@twind";
import { Handlers } from "$fresh/server.ts";
import { emojify } from "$emoji";
import algoliasearch from "$algolia";
import "https://deno.land/x/xhr@0.2.0/mod.ts";

import { PopularityModuleTag } from "@/util/registry_utils.ts";

import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import { InlineCode } from "@/components/InlineCode.tsx";
import * as Icons from "@/components/Icons.tsx";
import { CodeBlock } from "@/components/CodeBlock.tsx";
import { PopularityTag } from "../../components/PopularityTag.tsx";

const client = algoliasearch(
  "QFPCRZC6WX",
  "2ed789b2981acd210267b27f03ab47da",
);
const index = client.initIndex("modules");

export interface Data {
  hits: Array<{
    popularity_score: number;
    description?: string;
    name: string;
    popularity_tag?: PopularityModuleTag["value"];
  }>;
  nbHits: number;
  page: number;
  nbPages: number;
  query: string;
  hitsPerPage: number;
}

export default function ThirdPartyRegistryList({ url, data }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>Third Party Modules | Deno</title>
      </Head>
      <div>
        <Header selected="Third Party Modules" />

        <img
          src="/images/module_banner.png"
          alt="Deno in Space"
          class={tw`hidden md:block`}
        />

        <div class={tw`section-x-inset-lg mt-16 mb-24 space-y-15`}>
          <div class={tw`flex items-start gap-14`}>
            <div class={tw`space-y-4 w-full`}>
              <h1 class={tw`font-bold text-3xl text-black`}>
                Deno Third Party Modules
              </h1>

              <div class={tw`leading-5 text-[#6C6E78] space-y-3`}>
                <p>
                  <span class={tw`font-semibold text-default`}>
                    deno.land/x
                  </span>{" "}
                  is a hosting service for Deno scripts. It caches releases of
                  open-source modules stored on GitHub and serves them at an
                  easy-to-remember domain.
                </p>
                <p>
                  Deno can import modules from any location on the web, like
                  GitHub, a personal webserver, or a CDN like{" "}
                  <a href="https://esm.sh/" class={tw`link`}>
                    esm.sh
                  </a>
                  ,{" "}
                  <a href="https://www.skypack.dev" class={tw`link`}>
                    Skypack
                  </a>
                  ,{" "}
                  <a href="https://jspm.io" class={tw`link`}>
                    jspm.io
                  </a>{" "}
                  or{" "}
                  <a href="https://www.jsdelivr.com/" class={tw`link`}>
                    jsDelivr
                  </a>
                  .
                </p>
                <p>
                  To make it easier to consume third party modules Deno provides
                  some built in tooling like{" "}
                  <a class={tw`link`} href="/manual/tools/dependency_inspector">
                    <InlineCode>deno info</InlineCode>
                  </a>{" "}
                  and{" "}
                  <a
                    class={tw`link`}
                    href="/manual/tools/documentation_generator"
                  >
                    <InlineCode>deno doc</InlineCode>
                  </a>
                  .
                </p>
              </div>

              <div class={tw`space-x-2`}>
                <a
                  href="/add_module"
                  class={tw`rounded-md px-4.5 py-2.5 inline-flex items-center gap-1.5 leading-none font-medium text-white bg-tag-blue hover:bg-[#3587EF]`}
                >
                  <Icons.Plus />
                  <div>Publish a module</div>
                </a>

                <a
                  href="#Q&A"
                  class={tw`px-4.5 py-2.5 rounded-md font-medium leading-none bg-[#F3F3F3] hover:bg-dark-border`}
                >
                  Learn more
                </a>
              </div>
            </div>

            {
              /*<div class={tw`px-9 py-6 rounded-xl border border-dark-border`}>
              <span class={tw`text-[#6C6E78] leading-5 whitespace-nowrap`}>
                modules registered
              </span>
            </div>*/
            }
          </div>

          <div class={tw`border border-dark-border rounded-lg overflow-hidden`}>
            <form
              class={tw`px-5 py-4 flex items-center justify-between border-b border-dark-border bg-ultralight leading-none`}
              method="get"
            >
              <span class={tw`font-semibold`}>Explore Modules</span>
              <label
                class={tw`px-4 h-9 w-full md:w-88 bg-white rounded-md flex items-center gap-1.5 box-content border border-dark-border text-gray-400 focus-within:${
                  css({
                    "outline": "solid",
                  })
                }`}
              >
                <input
                  type="text"
                  name="query"
                  placeholder={`Search through ${data.nbHits} modules...`}
                  class={tw`w-full bg-transparent text-default placeholder:text-gray-400 outline-none`}
                  value={data.query}
                />
                <Icons.MagnifyingGlass />
              </label>
            </form>

            <ul class={tw`divide-y`}>
              {data.hits.length
                ? data.hits.map((result) => (
                  <li class={tw`border-dark-border`}>
                    <a
                      href={"/x/" + result.name}
                      class={tw`flex items-center justify-between px-5 py-3 gap-6 hover:bg-ultralight`}
                    >
                      <div>
                        <div class={tw`text-tag-blue font-semibold`}>
                          {result.name}
                        </div>
                        <div class={tw`text-gray-400`}>
                          {result.description
                            ? emojify(result.description)
                            : (
                              <span class={tw`italic font-semibold`}>
                                No description
                              </span>
                            )}
                        </div>
                      </div>

                      <div class={tw`flex items-center gap-2`}>
                        {result.popularity_tag && (
                          <PopularityTag>{result.popularity_tag}</PopularityTag>
                        )}
                        <Icons.ArrowRight class="text-gray-400" />
                      </div>
                    </a>
                  </li>
                ))
                : (
                  <div
                    class={tw`p-4 text-center sm:text-left text-sm leading-5 font-medium text-gray-500`}
                  >
                    No modules found. Please let us know what you're looking for
                    by{" "}
                    <a
                      class={tw`link`}
                      href="https://github.com/denoland/wanted_modules/issues"
                    >
                      opening an issue here
                    </a>.
                  </div>
                )}
            </ul>

            <div
              class={tw`px-5 py-4 border-t border-dark-border bg-ultralight flex items-center justify-between`}
            >
              {!!data.hits.length && <Pagination {...data} />}
            </div>
          </div>

          <div id="Q&A" class={tw`space-y-6`}>
            <h1 class={tw`font-bold text-3xl text-black`}>Q&A</h1>

            <div class={tw`space-y-3`}>
              <h2 class={tw`text-xl leading-6 font-semibold`}>
                How do I use modules on deno.land/x?
              </h2>
              <p class={tw`text-[#6C6E78] leading-5`}>
                The basic format of code URLs is{" "}
                <InlineCode>
                  https://deno.land/x/IDENTIFIER@VERSION/FILE_PATH
                </InlineCode>
                . If you leave out the version it will be defaulted to the most
                recent version released for the module.
              </p>
            </div>

            <div class={tw`space-y-3`}>
              <h2 class={tw`text-xl leading-6 font-semibold`}>
                Can I find functionality built-in to Deno here?
              </h2>
              <p class={tw`text-[#6C6E78] leading-5`}>
                No, the built-in runtime is documented on{" "}
                <a class={tw`link`} href="https://doc.deno.land/">
                  deno doc
                </a>{" "}
                and in the manual. See <a href="/std" class={tw`link`}>/std</a>
                {" "}
                for the standard modules.
              </p>
            </div>

            <div class={tw`space-y-3`}>
              <h2 class={tw`text-xl leading-6 font-semibold`}>
                I am getting a warning when importing from deno.land/x!
              </h2>
              <p class={tw`text-[#6C6E78] leading-5`}>
                deno.land/x warns you when you are implicitly importing the
                latest version of a module (when you do not explicitly specify a
                version). This is because it can{" "}
                <a
                  href="https://github.com/denoland/dotland/issues/997"
                  class={tw`link`}
                >
                  be unsafe to not tag dependencies
                </a>
                . To get rid of the warning, explicitly specify a version.
              </p>
            </div>

            <div class={tw`space-y-3`}>
              <h2 class={tw`text-xl leading-6 font-semibold`}>
                Can I edit or remove a module on deno.land/x?
              </h2>
              <p class={tw`text-[#6C6E78] leading-5`}>
                Module versions are persistent and immutable. It is thus not
                possible to edit or delete a module (or version), to prevent
                breaking programs that rely on this module. Modules may be
                removed if there is a legal reason to do (for example copyright
                infringement).
              </p>
            </div>

            <div class={tw`space-y-3`}>
              <h2 class={tw`text-xl leading-6 font-semibold`}>
                I can't find a specific module. Help!
              </h2>
              <a
                href="https://github.com/denoland/wanted_modules/issues"
                class={tw`rounded-md leading-none font-medium bg-tag-blue px-4.5 py-2.5 inline-flex items-center text-white gap-1.5 hover:bg-[#3587EF]`}
              >
                <div>Open an issue here</div>
                <Icons.ArrowRight />
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export function Pagination(
  { query, page, hitsPerPage, hits, nbHits, nbPages }: Data,
) {
  function toPage(n: number): string {
    const params = new URLSearchParams();
    if (query) {
      params.set("query", query);
    }
    params.set("page", (n + 1).toString());
    return "/x?" + params.toString();
  }

  return (
    <>
      <div
        class={tw`p-3.5 rounded-lg border border-dark-border px-2.5 py-1.5 flex items-center gap-2.5 bg-white`}
      >
        <MaybeA disabled={page === 0} href={toPage(page - 1)}>
          <Icons.ArrowLeft />
        </MaybeA>
        <div class={tw`leading-none`}>
          Page <span class={tw`font-medium`}>{page + 1}</span> of{" "}
          <span class={tw`font-medium`}>{nbPages}</span>
        </div>
        <MaybeA disabled={(page + 1) >= nbPages} href={toPage(page + 1)}>
          <Icons.ArrowRight />
        </MaybeA>
      </div>

      <div class={tw`text-sm text-[#6C6E78]`}>
        Showing{" "}
        <span class={tw`font-medium`}>
          {page * hitsPerPage + 1}
        </span>{" "}
        to{" "}
        <span class={tw`font-medium`}>
          {page * hitsPerPage + hits.length}
        </span>{" "}
        of{" "}
        <span class={tw`font-medium`}>
          {nbHits}
        </span>
      </div>
    </>
  );
}

function MaybeA(
  props:
    | ({ disabled: true } & ComponentProps<"div">)
    | ({ disabled: false } & ComponentProps<"a">),
) {
  if (props.disabled) {
    return <div {...props} class={tw`text-[#D2D2DC] cursor-not-allowed`} />;
  } else {
    return <a {...props} class={tw`hover:text-light`} />;
  }
}

export const handler: Handlers<Data> = {
  async GET(req, { render }) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1") - 1;
    const query = url.searchParams.get("query") || "";
    const res: Data = await index.search(query, {
      page,
      hitsPerPage: 20,
    });

    return render!(res);
  },
};
