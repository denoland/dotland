// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { ComponentChildren, Fragment, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { tw } from "@twind";
import { Cross } from "@/components/Icons.tsx";

export default function HelloBar(props: {
  to: string;
  children: ComponentChildren;
}) {
  const [helloBar, setHelloBar] = useState(false);

  useEffect(() => {
    setHelloBar(!localStorage.getItem("helloBar"));
  }, []);

  return (
    <div>
      {helloBar
        ? (
          <div
            class={tw`text-center bg-black text-white p-1 flex items-center justify-between flex-wrap`}
          >
            <div class={tw`flex-grow text-center`}>
              <a
                href={props.to}
                target="_blank"
                class={tw`inline-block p-1 hover:text-underline`}
              >
                {props.children}
              </a>
            </div>
            <div
              onClick={() => {
                localStorage.setItem("helloBar", "closed");
                setHelloBar(false);
              }}
            >
              <Cross />
            </div>
          </div>
        )
        : <></>}
    </div>
  );
}
