/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import * as Icons from "@/components/Icons.tsx";

export default function AddModule() {
  const [name, setName] = useState("");
  const [subdirectory, setSubdirectory] = useState("");
  const urlValue = name +
    (subdirectory
      ? ("?" + new URLSearchParams([["subdir", subdirectory]]).toString())
      : "");

  return (
    <div class={tw`space-y-12`}>
      <div class={tw`flex items-start`}>
        <div
          class={tw
            `hidden lg:block p-1.75 rounded-full bg-tag-blue mr-4.5 mt-1.5`}
        >
          <Icons.NameTag />
        </div>
        <div>
          <h2 class={tw`text-default font-semibold text-xl leading-none`}>
            Module name
          </h2>
          <p class={tw`text-[#6C6E78] mb-5`}>
            To get started please type the module name:
          </p>
          <input
            type="text"
            pattern="^[a-z0-9_]{3,40}$"
            placeholder="Module Name"
            class={tw`w-full lg:w-136 h-10 py-3 px-4 bg-[#F3F3F3] rounded-md`}
            value={name}
            onInput={(e) => setName(e.currentTarget.value)}
          />
        </div>
      </div>

      <div class={tw`flex items-start`}>
        <div
          class={tw
            `hidden lg:block p-1.75 rounded-full bg-[#9CA0AA] mr-4.5 mt-1.5`}
        >
          <Icons.Gear />
        </div>
        <div>
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
              class={tw
                `w-full lg:w-136 h-10 py-3 px-4 bg-[#F3F3F3] rounded-md mt-2`}
              value={subdirectory}
              onInput={(e) => setSubdirectory(e.currentTarget.value)}
            />
          </label>
        </div>
      </div>

      <div class={tw`flex items-start`}>
        <div
          class={tw
            `hidden lg:block p-1.75 rounded-full bg-[#20B44B] mr-4.5 mt-1.5`}
        >
          <Icons.TriangleWithRoundedCorners />
        </div>
        <div class={tw`space-y-5`}>
          <div>
            <h2 class={tw`text-default font-semibold text-xl leading-none`}>
              Add the webhook
            </h2>
            <p class={tw`text-[#6C6E78]`}>
              You can now add the webhook to your repository.
            </p>
          </div>
          <div
            class={tw
              `w-full lg:w-136 py-3 px-3 bg-[#F3F3F3] rounded-md flex items-center justify-between`}
          >
            <div class={tw`space-x-2 flex items-center text-sm`}>
              <div
                class={tw
                  `bg-[#20B44B1A] py-1 px-2 rounded-md font-medium text-[#20B44B]`}
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
            <button
              class={tw`rounded p-1.5 border border-[#D2D2DC]`}
              onClick={() =>
                navigator.clipboard.writeText(
                  "https://api.deno.land/webhook/gh/" + urlValue,
                )}
            >
              <Icons.Copy />
            </button>
          </div>

          <ol class={tw`list-decimal list-inside leading-8`}>
            <li>Navigate to the repository you want to add.</li>
            <li>
              Go to the <span class={tw`font-bold`}>Settings</span> tab.
            </li>
            <li>
              Click on the <span class={tw`font-bold`}>Webhooks</span> tab.
            </li>
            <li>
              Click on the <span class={tw`font-bold`}>Add webhook</span>{" "}
              button.
            </li>
            <li>
              Enter the above URL in the{" "}
              <span class={tw`font-bold`}>payload URL</span> field.
            </li>
            <li>
              Select <span class={tw`font-bold`}>application/json</span>{" "}
              as the content type.
            </li>
            <li>
              Select<span class={tw`font-bold`}>
                Let me select individual events.
              </span>
            </li>
            <li>
              Select only the{" "}
              <span class={tw`font-bold`}>Branch or tag creation</span> event.
            </li>
            <li>
              Press <span class={tw`font-bold`}>Add webhook</span>.
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
        </div>
      </div>
    </div>
  );
}
