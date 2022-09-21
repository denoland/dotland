// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "@twind";
import { ContentMeta } from "@/components/ContentMeta.tsx";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import AddModule from "@/islands/AddModule.tsx";
import * as Icons from "@/components/Icons.tsx";

export default function AddModulePage() {
  return (
    <>
      <ContentMeta
        title="Third Party Modules"
        description="Register a module with deno.land/x."
        creator="@deno_land"
        keywords={["deno", "registry", "modules", "javascript", "typescript"]}
      />
      <div>
        <Header selected="Third Party Modules" />
        <div
          class={tw`section-x-inset-xl mt-16 mb-28 flex items-center flex-col gap-12 lg:(items-start flex-row gap-36)`}
        >
          <div class={tw`text-base w-full lg:w-88 flex-shrink-0 space-y-5`}>
            <h1 class={tw`font-bold text-3xl leading-none`}>Adding a module</h1>
            <div>
              <p>
                All modules on <b class={tw`font-semibold`}>deno.land/x</b>{" "}
                need to be hosted as public repositories on{" "}
                <a href="https://github.com" class={tw`link`}>GitHub.com</a>.
              </p>
              <br />
              <p>
                <b class={tw`font-semibold`}>deno.land/x</b>{" "}
                downloads and stores your repository contents every time you
                create a git tag. We only do this once for every tag. This
                ensures that the contents we serve for a specific version can
                never change.
              </p>
              <br />
              <p>
                Our service needs to get informed whenever a new tag is created.
                For this purpose we use GitHub webhooks.
              </p>
            </div>
            <a href="/x" class={tw`button-alternate`}>
              <Icons.ChevronLeft />
              <span>Browse Modules</span>
            </a>
          </div>
          <AddModule />
        </div>
        <Footer />
      </div>
    </>
  );
}
