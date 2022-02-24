// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { ComponentChildren, Fragment, h, Head } from "../deps.ts";
import { CDN_ENDPOINT, getVersionList } from "../util/registry_utils.ts";
import { Header } from "../components/Header.tsx";
import { InlineCode } from "../components/InlineCode.tsx";
import { Footer } from "../components/Footer.tsx";

export default function AddModulePage() {
  return (
    <>
      <Head>
        <title>Third Party Modules | Deno</title>
      </Head>
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
      <div class="bg-gray">
        <Header subtitle="Third Party Modules" widerContent={true} />
        <form
          class="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 mt-8"
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
        >
          <section class="inset-y-0 px-10 flex">
            <div class="flex flex-col space-y-4 my-auto px-4 md:px-16 lg:px-24 xl:px-32">
              <div class="my-auto py-10">
                <ModuleStep title="Adding a module">
                  <p class="text-base">
                    All modules on <b class="font-semibold">deno.land/x</b>{" "}
                    need to be hosted as public repositories on GitHub.com.
                  </p>
                  <p class="text-base">
                    <b class="font-semibold">deno.land/x</b>{" "}
                    downloads and stores your repository contents every time you
                    create a git tag. We only do this once for every tag. This
                    ensures that the contents we serve for a specific version
                    can never change.
                  </p>
                  <p class="text-base">
                    Our service needs to get informed whenever a new tag is
                    created. For this purpose we use GitHub webhooks.
                  </p>
                </ModuleStep>
                <ModuleStep title="Select a module name">
                  <p>To get started please select a module name:</p>
                  <div>
                    <label htmlFor="modulename" class="font-semibold sr-only">
                      Module Name
                    </label>
                    <input
                      id="modulename"
                      pattern="^[a-z0-9_]{3,40}$"
                      class="block w-full px-4 py-2 my-1 leading-normal bg-white border border-gray-200 rounded-lg outline-none shadow hover:shadow-sm focus:shadow-sm appearance-none focus:border-gray-300 hover:border-gray-300 mt-1 invalid:(border-red-300 hover:border-red-300 focus:border-red-300)"
                      type="text"
                      placeholder="Module Name"
                      autoComplete="off"
                      onInvalid="((e) => {
                        document.getElementById('moduleNameNotAvailable').style.display = 'none';
                        document.getElementById('moduleNameAvailable').style.display = 'none';
                        e.target.classList.add(...MODULENAME_INVALID_CLASSES);
                        e.target.classList.remove(...MODULENAME_VALID_CLASSES);
                      })(event)"
                      onInput={`(async (e) => {
                        updateWebhookUrl();
                        if (!e.target.checkValidity()) {
                          document.getElementById('moduleNameNotAvailable').style.display = 'none';
                          document.getElementById('moduleNameAvailable').style.display = 'none';
                          e.target.classList.add(...MODULENAME_INVALID_CLASSES);
                          e.target.classList.remove(...MODULENAME_VALID_CLASSES);
                          return;
                        }
                        const available = await getVersionList(e.target.value)
                          .then((e) => !e)
                          .catch(() => false);

                        if (available) {
                          document.getElementById('moduleNameNotAvailable').style.display = 'none';
                          document.getElementById('moduleNameAvailable').style.display = 'block';
                          console.log(e.target.classList);
                          e.target.classList.add(...MODULENAME_VALID_CLASSES);
                          e.target.classList.remove(...MODULENAME_INVALID_CLASSES);
                        } else {
                          document.getElementById('moduleNameAvailable').style.display = 'none';
                          document.getElementById('moduleNameNotAvailable').style.display = 'block';
                          e.target.classList.add(...MODULENAME_INVALID_CLASSES);
                          e.target.classList.remove(...MODULENAME_VALID_CLASSES);
                        }
                      })(event)`}
                      required
                    />
                    <div>
                      <div
                        id="moduleNameAvailable"
                        class="text-green-500 mb-2 hidden"
                      >
                        This module name is available.
                      </div>
                      <div
                        id="moduleNameNotAvailable"
                        class="text-red-400 mb-2 hidden"
                      >
                        This module name is not available for a new author. If
                        this module is already registered to your name,
                        continue.
                      </div>
                    </div>
                    <span class="text-red-400">
                      The module name must be between 3 and 40 characters and
                      contain only the characters a-z, 0-9 and _.
                    </span>
                  </div>
                </ModuleStep>
                <ModuleStep title="Advanced options">
                  <p>
                    There are some more optional settings to set up:
                  </p>
                  <div class="mt-2">
                    <label htmlFor="subdirectory" class="font-medium">
                      Subdirectory
                    </label>
                    <input
                      id="subdirectory"
                      class="block w-full px-4 py-2 my-1 leading-normal bg-white border border-gray-200 rounded-lg outline-none shadow hover:shadow-sm focus:shadow-sm appearance-none focus:border-gray-300 hover:border-gray-300 mt-1 valid:(border-green-300 hover:border-green-300 focus:border-green-300) invalid:(border-red-300 hover:border-red-300 focus:border-red-300)"
                      type="text"
                      placeholder="Subdirectory"
                      pattern="^([^(/)])(.*\/$)"
                      onInput="updateWebhookUrl()"
                    />
                    <span class="text-red-400 hidden">
                      The provided subdirectory is not valid. It must end with a
                      {" "}
                      <InlineCode>/</InlineCode>, but may not start with one.
                      (e.g. <InlineCode>src/</InlineCode>)
                    </span>
                    <span class="text-gray-500">
                      Optional. A subdirectory in your repository that the
                      module to be published is located in.
                    </span>
                  </div>
                </ModuleStep>
                <ModuleStep title="Add the webhook">
                  <p>You can now add the webhook to your repository.</p>
                  <ol class="list-decimal list-outside mr-4 pl-2 ">
                    <li>Navigate to the repository you want to add.</li>
                    <li>
                      Go to the <InlineCode>Settings</InlineCode> tab.
                    </li>
                    <li>
                      Click on the <InlineCode>Webhooks</InlineCode> tab.
                    </li>
                    <li>
                      Click on the <InlineCode>Add webhook</InlineCode> button.
                    </li>
                    <li>
                      Enter the URL{" "}
                      <InlineCode id="webhookURL">
                        https://api.deno.land/webhook/gh/
                      </InlineCode>{" "}
                      in the payload URL field.
                    </li>
                    <li>
                      Select <InlineCode>application/json</InlineCode>{" "}
                      as the content type.
                    </li>
                    <li>
                      Select{" "}
                      <InlineCode>
                        Let me select individual events.
                      </InlineCode>
                    </li>
                    <li>
                      Select only the{" "}
                      <InlineCode>Branch or tag creation</InlineCode> event.
                    </li>
                    <li>
                      Press <InlineCode>Add webhook</InlineCode>.
                    </li>
                  </ol>
                  <video
                    class="rounded-md border border-gray-200 w-full mt-1"
                    src={"/images/add_webhook.mp4"}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div class="rounded-md shadow-sm mt-2">
                    <button
                      role="submit"
                      class="w-full flex justify-center py-2 px-4 border border-gray-300 text-md font-medium rounded-md text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out"
                    >
                      Submit
                    </button>
                  </div>

                  <div
                    id="addModuleSuccess"
                    class="mt-2 p-2 bg-gray-50 rounded-md border text-green-800 border-green-200 hidden"
                  >
                    Module successfully registered! To upload a version, create
                    a new tag / release in the repository.
                  </div>
                  <div
                    id="addModulePending"
                    class="mt-2 p-2 bg-gray-50 rounded-md border text-gray-800 border-gray-200 hidden"
                  >
                    Waiting to receive initial WebHook event from GitHub...
                  </div>
                </ModuleStep>
              </div>
            </div>
          </section>
        </form>
        <Footer simple />
      </div>
    </>
  );
}

function ModuleStep(
  { title, children }: { title: string; children: ComponentChildren },
) {
  return (
    <div class="mt-6">
      <header class="mb-1">
        <h2 class="text-2xl leading-7 font-medium text-gray-900">{title}</h2>
      </header>
      <hr class="mx-1" />
      <div class="mt-2">
        {children}
      </div>
    </div>
  );
}
