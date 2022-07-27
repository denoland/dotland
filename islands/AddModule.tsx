/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
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
    <div class={tw`space-y-12`}>
      <div class={tw`flex items-start`}>
        <div
          class={tw`hidden lg:block p-1.75 rounded-full bg-tag-blue mr-4.5 mt-1.5`}
        >
          <Icons.NameTag />
        </div>
        <div class={tw`w-full`}>
          <h2 class={tw`text-default font-semibold text-xl leading-none`}>
            Module name
          </h2>
          <p class={tw`text-[#6C6E78] mb-5`}>
            To get started please type the module name:
          </p>
          <input
            type="text"
            placeholder="Module Name"
            class={tw`w-full lg:w-136 h-10 py-3 px-4 rounded-md ${
              name && !available
                ? "text-[#F00C08] border border-[#F00C08] bg-transparent"
                : "bg-[#F3F3F3]"
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
            <p class={tw`mt-1.5 text-[#F00C08] text-sm`}>
              Invalid Name/Name has been taken!
            </p>
          )}
        </div>
      </div>

      <div class={tw`flex items-start`}>
        <div
          class={tw`hidden lg:block p-1.75 rounded-full bg-[#9CA0AA] mr-4.5 mt-1.5`}
        >
          <Icons.Gear />
        </div>
        <div class={tw`w-full`}>
          <h2 class={tw`text-default font-semibold text-xl leading-none`}>
            Advanced options
          </h2>
          <p class={tw`text-[#6C6E78] mb-5`}>
            There are some more optional settings to set up:
          </p>
          <label>
            <span class={tw`font-medium`}>
              Subdirectory <span class={tw`text-[#9CA0AA]`}>(optional)</span>
            </span>
            <input
              type="text"
              pattern="^([^(/)])(.*/$)"
              placeholder="/"
              class={tw`w-full lg:w-136 h-10 py-3 px-4 bg-[#F3F3F3] rounded-md mt-2`}
              value={subdirectory}
              onInput={(e) => setSubdirectory(e.currentTarget.value)}
              disabled={!IS_BROWSER}
            />
          </label>
        </div>
      </div>

      <div class={tw`flex items-start`}>
        <div
          class={tw`hidden lg:block p-1.75 rounded-full bg-[#20B44B] mr-4.5 mt-1.5`}
        >
          <Icons.Webhook />
        </div>
        <div class={tw`space-y-5`}>
          <div>
            <h2 class={tw`text-default font-semibold text-xl leading-none`}>
              Add the webhook
              {available && !registered &&
                (
                  <div
                    class={tw`inline-flex ml-2 py-1 px-3 bg-[#4B505A] rounded-md text-white text-sm leading-tight font-medium items-center`}
                  >
                    <Icons.Spinner />
                    <span class={tw`ml-2`}>Waiting...</span>
                  </div>
                )}

              <canvas
                class={tw`inset-0 fixed w-screen h-screen pointer-events-none`}
                ref={confettiRef}
              />
            </h2>
            <p class={tw`text-[#6C6E78]`}>
              You can now add the webhook to your repository.
            </p>
          </div>
          <div
            class={tw`w-full lg:w-136 py-3 px-3 bg-[#F3F3F3] rounded-md flex items-center justify-between`}
          >
            <div class={tw`space-x-2 flex items-center text-sm`}>
              <div
                class={tw`py-1 px-2 rounded-md font-medium bg-[#9CA0AA] text-white`}
              >
                Payload URL
              </div>
              <span class={tw`overflow-x-auto`}>
                https://api.deno.land/webhook/gh/<span
                  class={tw`font-semibold`}
                >
                  {urlValue}
                </span>
              </span>
            </div>
            {available &&
              (
                <button
                  class={tw`rounded p-1.5 border border-[#D2D2DC]`}
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
                <div
                  class={tw`py-3.5 px-4 text-[#20B44B] border border-[#20B44B] rounded-lg w-full lg:w-136 flex items-center`}
                >
                  <Icons.StatusOK />
                  <span class={tw`ml-2.5 font-medium`}>
                    Module successfully registered!
                  </span>
                </div>
                <p class={tw`mt-3`}>
                  To upload a version, create a new{" "}
                  <span class={tw`font-semibold`}>tag</span>/<span
                    class={tw`font-semibold`}
                  >
                    release
                  </span>{" "}
                  in the repository.
                </p>
              </div>
            )
            : (
              <>
                <ol class={tw`list-decimal list-inside leading-8`}>
                  <li>Navigate to the repository you want to add.</li>
                  <li>
                    Go to the <span class={tw`font-semibold`}>Settings</span>
                    {" "}
                    tab.
                  </li>
                  <li>
                    Click on the <span class={tw`font-semibold`}>Webhooks</span>
                    {" "}
                    tab.
                  </li>
                  <li>
                    Click on the{" "}
                    <span class={tw`font-semibold`}>Add webhook</span> button.
                  </li>
                  <li>
                    Enter the above URL in the{" "}
                    <span class={tw`font-semibold`}>payload URL</span> field.
                  </li>
                  <li>
                    Select{" "}
                    <span class={tw`font-semibold`}>application/json</span>{" "}
                    as the content type.
                  </li>
                  <li>
                    Select{" "}
                    <span class={tw`font-semibold`}>
                      Let me select individual events.
                    </span>
                  </li>
                  <li>
                    Select only the{" "}
                    <span class={tw`font-semibold`}>
                      Branch or tag creation
                    </span>{" "}
                    event.
                  </li>
                  <li>
                    Press <span class={tw`font-semibold`}>Add webhook</span>.
                  </li>
                </ol>

                <video
                  class={tw`rounded-lg border border-dark-border w-full lg:w-136`}
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
