/** @jsx h */
/** @jsxFrag Fragment */
import { h, VNode } from "preact";
import { tw } from "@twind";
import { useState } from "preact/hooks";
import { CodeBlock } from "@/components/CodeBlock.tsx";
import * as Icons from "@/components/Icons.tsx";

export default function Frameworks() {
  const [fw, setFw] = useState<"fresh" | "aleph">("fresh");

  return (
    <div class={tw`relative bg-ultralight`}>
      <div class={tw`w-[750px] mx-auto py-16`}>
        <hgroup class={tw`flex flex-col w-full flex items-center`}>
          <h2 class={tw`text-2xl font-semibold`}>
            How to build a website with Deno
          </h2>
          <h3 class={tw`text-gray-400 leading-none`}>
            SSR, Streaming, File-system routing, etc...
          </h3>
        </hgroup>
        <div class={tw`flex justify-between gap-3 mb-4 mt-12`}>
          <FWCard
            name="Fresh"
            description="The next-gen web framework."
            url="https://fresh.deno.dev"
            active={fw === "fresh"}
            onMouseEnter={() => setFw("fresh")}
            logo={
              <svg
                width="24"
                height="20"
                viewBox="0 0 24 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.2439 2.11047C26.0488 9.21369 22.5366 15.7907 20.1951 17.6323C20.1951 18.6846 17.561 20.0001 16.6829 19.4739C13.1707 20.7893 5.56099 18.9477 1.17075 13.9492C-0.585351 12.1076 1.46343 8.42444 7.31709 4.47821C11.122 1.84739 16.9756 0.00581193 22.2439 2.11047Z"
                  fill="#FFD80B"
                />
                <path
                  d="M2.92687 16.565C2.04882 16.565 2.3415 16.565 1.17077 13.9491L0.292723 12.6337C-1.75606 6.58281 15.8049 -2.88815 21.0732 1.05809C27.8049 5.00432 10.5366 12.6337 6.14638 13.1599C5.56102 13.1599 4.97565 13.423 4.68297 13.9491C3.51224 16.565 3.80492 16.565 2.92687 16.565Z"
                  fill="white"
                />
                <path
                  d="M17.8537 1.84731C22.2439 1.58423 20.4878 4.47813 16.0976 6.84587L10.5366 9.47669C9.95126 9.73978 9.36589 8.95053 8.78053 9.47669L7.90248 11.0552C7.02443 11.3183 4.0976 11.8444 3.21955 11.5814C1.75614 11.0552 1.75614 9.21361 4.68297 6.84587L6.73175 5.79354C6.43906 5.26738 6.43906 5.26738 7.31711 4.47813C8.19516 3.95197 12.8781 1.84731 15.8049 1.58423L16.0976 2.11039L17.8537 1.84731Z"
                  fill="#FFED4E"
                />
                <path
                  d="M8.78052 7.10903C9.0732 6.84595 9.65857 6.58287 9.65857 6.0567L12 5.26746C12 5.53054 11.7073 6.0567 12.2927 6.31978C11.7073 6.58287 10.2439 6.58287 9.95125 7.6352C9.65857 7.10903 9.65857 7.10903 8.78052 7.10903Z"
                  fill="white"
                />
              </svg>
            }
            showcases={[
              {
                title: "This page, deno.land",
                previewUrl: "https://deno.land",
                sourceUrl: "https://github.com/denoland/dotland",
              },
              {
                title: "Chat",
                previewUrl: "https://showcase-chat.deno.dev/",
                sourceUrl: "https://github.com/denoland/showcase_chat",
              },
              {
                title: "E-commerce store",
                previewUrl: "https://merch.deno.com/",
                sourceUrl: "https://github.com/denoland/merch",
              },
            ]}
          />
          <FWCard
            name="Aleph.js"
            description="A full-stack framework in Deno."
            url="https://alephjs.org"
            active={fw === "aleph"}
            onMouseEnter={() => setFw("aleph")}
            logo={
              <svg
                width="24"
                height="20"
                viewBox="0 0 24 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.7334 1.35559C15.7111 6.51115 18.6889 11.6667 21.6667 16.8223C21.3111 17.4223 20.9334 18.0445 20.5778 18.6445C14.6222 18.6445 8.64446 18.6445 2.68891 18.6445C2.35558 18.0445 2.00002 17.4445 1.66669 16.8445C4.64446 11.6889 7.62224 6.51115 10.6222 1.35559C11.3111 1.35559 12.0222 1.35559 12.7334 1.35559Z"
                  stroke="#D63369"
                  stroke-miterlimit="10"
                />
                <path
                  d="M6.82227 15.0667H18.5112L10.5778 1.35559"
                  stroke="#D63369"
                  stroke-miterlimit="10"
                />
                <path
                  d="M16.4445 15.0445L10.6 4.93335L2.6889 18.6445"
                  stroke="#D63369"
                  stroke-miterlimit="10"
                />
                <path
                  d="M11.6222 6.7334L5.77777 16.8445H21.6222"
                  stroke="#D63369"
                  stroke-miterlimit="10"
                />
              </svg>
            }
            showcases={[
              {
                title: "Deno Deploy Dashboard",
                previewUrl: "https://dash.deno.com",
              },
              {
                title: "Meet-me calendar",
                previewUrl: "https://meet-me.deno.dev",
                sourceUrl: "https://github.com/denoland/meet-me",
              },
            ]}
          />
        </div>
        {fw === "fresh" && <FreshGettingStart />}
        {fw === "aleph" && <AlephGettingStart />}
      </div>
    </div>
  );
}

type FWProps = {
  logo: VNode;
  name: string;
  description: string;
  url: string;
  showcases: { title: string; previewUrl: string; sourceUrl?: string }[];
  active?: boolean;
  onMouseEnter?: () => void;
};

function FWCard(props: FWProps) {
  return (
    <div
      class={tw`w-[50%] bg-white p-5 border-2 ${
        props.active
          ? "border-primary scale-100 opacity-100"
          : "border-gray-200 scale-95 opacity-90"
      } rounded-lg transition-all duration-300 ease-in-out`}
      onMouseEnter={props.onMouseEnter}
    >
      <h2
        class={tw`text-lg font-medium leading-none flex items-center gap-1.5`}
      >
        {props.logo} {props.name}
      </h2>
      <p class={tw`text-gray-400 leading-none mt-1.5`}>
        {props.description}
      </p>
      <p class={tw`leading-none mt-1`}>
        <a
          class={`link`}
          href={props.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.url}
        </a>
      </p>
      <ul
        class={tw`mt-4`}
      >
        {props.showcases.map((showcase) => (
          <li
            class={tw`flex items-center gap-1.5 px-2 mx-[-8px] rounded-md hover:bg-ultralight transition-colors duration-200`}
          >
            <a
              class={tw`flex-1 leading-none py-2 text-gray-800 hover:text-black transition-colors duration-200`}
              href={showcase.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {showcase.title}
            </a>
            {showcase.sourceUrl && (
              <a
                class={tw`text-gray-400 hover:text-default`}
                href={showcase.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Source"
              >
                <span class={tw`sr-only`}>Source</span>
                <Icons.GitHub class={tw`!w-4.5 !h-4.5`} />
              </a>
            )}
            <a
              class={tw`text-gray-400 hover:text-default`}
              href={showcase.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Preview"
            >
              <span class={tw`sr-only`}>Preview</span>
              <Icons.ExternalLink class={tw`!w-4 !h-4`} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FreshGettingStart() {
  return (
    <div class={tw`flex flex-col gap-4 text-default`}>
      <h3 class={tw`font-medium`}>Getting started</h3>
      <CodeBlock
        class={tw`!bg-white`}
        code="deno run -A -r https://fresh.deno.dev my-project"
        language="bash"
      />
      <p>
        Enter the newly created project directory and run the following command
        to start the development server:
      </p>
      <CodeBlock
        class={tw`!bg-white`}
        code="deno task start"
        language="bash"
      />
      <p>
        You can now open{" "}
        <strong class={tw`font-medium text-black`}>
          http://localhost:8000
        </strong>{" "}
        in your browser to view the page. A more in-depth getting started guide
        is available in the{" "}
        <a
          class={tw`link`}
          href="https://fresh.deno.dev/docs/introduction"
          target="_blank"
          rel="noopener noreferrer"
        >
          docs
        </a>.
      </p>
    </div>
  );
}

function AlephGettingStart() {
  return (
    <div class={tw`flex flex-col gap-4 text-default`}>
      <h3 class={tw`font-medium`}>Getting started</h3>
      <CodeBlock
        class={tw`!bg-white`}
        code="deno run -A -r https://deno.land/x/aleph init my-project"
        language="bash"
      />
      <p>
        Enter the newly created project directory and run the following command
        to start the development server:
      </p>
      <CodeBlock
        class={tw`!bg-white`}
        code="deno task dev"
        language="bash"
      />
      <p>
        You can now open{" "}
        <strong class={tw`font-medium text-black`}>
          http://localhost:3000
        </strong>{" "}
        in your browser to view the page. A more in-depth getting started guide
        is available in the{" "}
        <a
          class={tw`link`}
          href="https://alephjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          docs
        </a>.
      </p>
    </div>
  );
}
