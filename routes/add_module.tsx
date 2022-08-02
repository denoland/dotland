// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import AddModule from "@/islands/AddModule.tsx";
import * as Icons from "@/components/Icons.tsx";

export default function AddModulePage() {
  return (
    <>
      <Head>
        <title>Third Party Modules | Deno</title>
      </Head>
<<<<<<< HEAD
      <script>
        {`
          async function getVersionList(module) {
            const url = \`${CDN_ENDPOINT}\${module}/meta/versions.json\`;
            const res = await fetch(url, {
              headers: {
                accept: 'application/json',
              },
            });
            if (res.status === 403 || res.status === 404) return null;
            if (res.status !== 200) {
              throw Error(
                \`Got an error (\${res.status}) while getting the version list:\\n\${await res
            .text()}\`,
              );
            }
            
            return await res.json();
          }
          
          function updateWebhookUrl() {
            const name = document.getElementById('modulename').value;
            const subdir = document.getElementById('subdirectory').value;
            document.getElementById('webhookURL').innerText = \`https://api.deno.land/webhook/gh/\${name}\${subdir ? ('?subdir=' + encodeURIComponent(subdir)) : ''}\`;
          }
          
          const MODULENAME_VALID_CLASSES = ['border-green-300', 'hover:border-green-300', 'focus:border-green-300'];
          const MODULENAME_INVALID_CLASSES = ['border-red-300', 'hover:border-red-300', 'focus:border-red-300'];
        `}
      </script>
      <div class={tw`bg-gray`}>
        <Header selected="第三方模块" />
        <form
          class={tw`section-x-inset-lg mt-8`}
          // @ts-ignore onSubmit does support strings
          onSubmit="(async (e) => {
          e.preventDefault();
          const name = document.getElementById('modulename').value;
          while (true) {
            const available = await getVersionList(name)
              .then((e) => !e)
              .catch(() => false);
              console.log(available);
            if (available) {
              document.getElementById('addModuleSuccess').style.display = 'none';
              document.getElementById('addModulePending').style.display = 'block';
            } else {
              document.getElementById('addModulePending').style.display = 'none';
              document.getElementById('addModuleSuccess').style.display = 'block';
              break;
            }
            await new Promise(res => setTimeout(res, 2000));
          }
        })(event)"
=======
      <div>
        <Header selected="Third Party Modules" />
        <div
          class={tw`section-x-inset-xl mt-16 mb-28 flex items-center flex-col gap-12 lg:(items-start flex-row gap-36)`}
>>>>>>> fa9fac7a8ed9b78e38561b6f035867a1311c13b7
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
            <a
              href="/x"
              class={tw`inline-flex rounded-md bg-light-border py-3 px-4 items-center`}
            >
              <Icons.ArrowLeft />
              <span class={tw`ml-1.5`}>Browse Modules</span>
            </a>
          </div>
          <AddModule />
        </div>
        <Footer />
      </div>
    </>
  );
}
