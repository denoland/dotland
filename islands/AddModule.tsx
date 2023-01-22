// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import { useEffect, useRef, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import * as Icons from "@/components/Icons.tsx";
import { getVersionList } from "@/util/registry_utils.ts";
import confetti from "$canvas-confetti";

const NAME_REGEX = /^[a-z0-9_]{3,40}$/;

interface ModuleState {
  name: string;
  available: boolean | "pending";
  registered: boolean;
}

export default function AddModule() {
  const [subdirectory, setSubdirectory] = useState("");
  const confettiRef = useRef(null);
  const [moduleState, setModuleState] = useState<ModuleState>({
    name: "",
    available: "pending",
    registered: false,
  });
  const setModuleStateIfSameName = (state: ModuleState) => {
    setModuleState((previousValue) => {
      if (state.name !== previousValue.name) {
        return previousValue;
      } else {
        return state;
      }
    });
  };
  const { name, available, registered } = moduleState;

  const urlValue = name +
    (subdirectory
      ? ("?" + new URLSearchParams([["subdir", subdirectory]]).toString())
      : "");

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      if (name === "" || !NAME_REGEX.test(name)) {
        setModuleStateIfSameName({
          name,
          available: false,
          registered,
        });
      } else {
        await getVersionList(name, controller.signal)
          .then((e) => !e)
          .catch(() => false)
          .then((e) => {
            if (controller.signal.aborted) {
              return;
            }

            setModuleStateIfSameName({
              name,
              available: e,
              registered,
            });
          });
      }
    })();

    return () => controller.abort();
  }, [name]);

  useEffect(() => {
    if (available === "pending" || !available) {
      return;
    }

    const controller = new AbortController();

    const id = setInterval(async () => {
      await getVersionList(name, controller.signal)
        .then((e) => !!e)
        .catch(() => false)
        .then((registered) => {
          if (controller.signal.aborted) {
            return;
          }
          setModuleStateIfSameName({
            name,
            available,
            registered,
          });
          if (registered) {
            clearInterval(id);
            confetti.create(confettiRef.current!, {
              resize: true,
            })({
              particleCount: 1000,
              ticks: 500,
              spread: 180,
              startVelocity: 80,
              disableForReducedMotion: true,
              origin: {
                y: 0,
              },
            });
          }
        });
    }, 500);

    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, [available, name]);

  return (
    <div class="space-y-12">
      <div class="flex items-start">
        <div class="hidden lg:block p-1.75 rounded-full bg-primary mr-4.5 mt-1.5">
          <Icons.NameTag />
        </div>
        <div class="w-full">
          <h2 class="text-default font-semibold text-xl leading-none">
            Module name
          </h2>
          <p class="text-[#6C6E78] mb-5">
            To get started please type the module name:
          </p>
          <input
            type="text"
            placeholder="Module Name"
            class={`w-full lg:w-136 h-10 py-3 px-4 rounded-md ${
              name && !available
                ? "text-danger border border-danger bg-transparent"
                : "bg-grayDefault"
            }`}
            value={name}
            onInput={(e) => {
              setModuleState({
                name: e.currentTarget.value,
                available: "pending",
                registered: false,
              });
            }}
            disabled={!IS_BROWSER}
          />
          {name && !available && (
            <p class="mt-1.5 text-danger text-sm">
              Invalid Name/Name has been taken!
            </p>
          )}
        </div>
      </div>

      <div class="flex items-start">
        <div class="hidden lg:block p-1.75 rounded-full bg-gray-400 mr-4.5 mt-1.5">
          <Icons.Gear />
        </div>
        <div class="w-full">
          <h2 class="text-default font-semibold text-xl leading-none">
            Advanced options
          </h2>
          <p class="text-[#6C6E78] mb-5">
            There are some more optional settings to set up:
          </p>
          <label>
            <span class="font-medium">
              Subdirectory <span class="text-gray-400">(optional)</span>
            </span>
            <input
              type="text"
              pattern="^([^(/)])(.*/$)"
              placeholder="/"
              class="w-full lg:w-136 h-10 py-3 px-4 bg-grayDefault rounded-md mt-2"
              value={subdirectory}
              onInput={(e) => setSubdirectory(e.currentTarget.value)}
              disabled={!IS_BROWSER}
            />
          </label>
        </div>
      </div>

      <div class="flex items-start">
        <div class="hidden lg:block p-1.75 rounded-full bg-fresh mr-4.5 mt-1.5">
          <Icons.Webhook />
        </div>
        <div class="space-y-5">
          <div>
            <h2 class="text-default font-semibold text-xl leading-none">
              Add the webhook
              {available && !registered &&
                (
                  <div class="inline-flex ml-2 py-1 px-3 bg-[#4B505A] rounded-md text-white text-sm leading-tight font-medium items-center">
                    <Icons.Spinner />
                    <span class="ml-2">Waiting...</span>
                  </div>
                )}

              <canvas
                class="inset-0 fixed w-screen h-screen pointer-events-none"
                ref={confettiRef}
              />
            </h2>
            <p class="text-[#6C6E78]">
              You can now add the webhook to your repository.
            </p>
          </div>
          <div class="w-full lg:w-136 py-3 px-3 bg-grayDefault rounded-md flex items-center justify-between space-x-2 text-sm whitespace-nowrap">
            <div class="py-1 px-2 rounded-md font-medium bg-gray-400 text-white">
              Payload URL
            </div>
            <div class="overflow-x-auto w-full">
              https://api.deno.land/webhook/gh/<span class="font-semibold">
                {urlValue}
              </span>
            </div>
            {available &&
              (
                <button
                  class="rounded p-1.5 border border-[#D2D2DC] hover:bg-border"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "https://api.deno.land/webhook/gh/" + urlValue,
                    )}
                >
                  <Icons.Copy />
                </button>
              )}
          </div>

          {registered
            ? (
              <div>
                <div class="py-3.5 px-4 text-[#20B44B] border border-[#20B44B] rounded-lg w-full lg:w-136 flex items-center">
                  <Icons.StatusOK class="h-6 w-auto" />
                  <span class="ml-2.5 font-medium">
                    Module successfully registered!
                  </span>
                </div>
                <p class="mt-3">
                  To upload a version, create a new{" "}
                  <span class="font-semibold">
                    tag
                  </span>/<span class="font-semibold">
                    release
                  </span>{" "}
                  in the repository.
                </p>
              </div>
            )
            : (
              <>
                <ol class="list-decimal list-inside leading-8">
                  <li>Navigate to the repository you want to add.</li>
                  <li>
                    Go to the <span class="font-semibold">Settings</span> tab.
                  </li>
                  <li>
                    Click on the <span class="font-semibold">Webhooks</span>
                    {" "}
                    tab.
                  </li>
                  <li>
                    Click on the <span class="font-semibold">Add webhook</span>
                    {" "}
                    button.
                  </li>
                  <li>
                    Enter the above URL in the{" "}
                    <span class="font-semibold">payload URL</span> field.
                  </li>
                  <li>
                    Select <span class="font-semibold">application/json</span>
                    {" "}
                    as the content type.
                  </li>
                  <li>
                    Select{" "}
                    <span class="font-semibold">
                      Let me select individual events.
                    </span>
                  </li>
                  <li>
                    Select only the{" "}
                    <span class="font-semibold">
                      Branch or tag creation
                    </span>{" "}
                    event.
                  </li>
                  <li>
                    Press <span class="font-semibold">Add webhook</span>.
                  </li>
                </ol>

                <video
                  class="rounded-lg border border-border w-full lg:w-136"
                  src={"/images/add_webhook.mp4"}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </>
            )}
        </div>
      </div>
    </div>
  );
}
