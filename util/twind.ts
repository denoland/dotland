// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { IS_BROWSER } from "$fresh/runtime.ts";
import { apply, Configuration, setup as twSetup, Sheet } from "twind";
export * from "twind";
import { css } from "twind/css";
export { css };

export const config: Configuration = {
  preflight(preflight) {
    delete preflight["img,video"];
    return css(preflight, {
      html: { scrollBehavior: "smooth" },
      body: apply`text-default`,
    });
  },
  darkMode: "class",
  theme: {
    fontFamily: {
      mono: [
        "Menlo",
        "Monaco",
        '"Lucida Console"',
        "Consolas",
        '"Liberation Mono"',
        '"Courier New"',
        "monospace",
      ],
    },
    extend: {
      colors: {
        primary: "#FFFFFFE5",
        secondary: "#E5E7EB",
        main: "#333333",
        "default-highlight": "#333333C0",
        light: "#999999",
        default: "#232323",
        "default-15": "#23232326",
        ultralight: "#F8F7F6",
        "light-border": "#EEEEEE",
        border: "#DDDDDD",

        "tag-blue-bg": "#056CF025",
        "tag-blue": "#056CF0",
        "tag-blue2": "#448bef",
      },
      opacity: {
        15: ".15",
      },
      spacing: {
        1.75: "0.4375rem",
        4.5: "1.125rem",
        5.5: "1.375rem",
        15: "3.75rem",
        18: "4.5rem",
        22: "5.5rem",
        72: "18rem",
        76: "19rem",
        88: "22rem",
        136: "34rem",
      },
      animation: {
        move: "move 6s linear infinite",
      },
    },
  },
  plugins: {
    link:
      apply`text-[#056CF0] transition duration-75 ease-in-out hover:text-blue-400`,
    "section-x-inset": (parts) =>
      parts[0] === "none"
        ? apply`max-w-none mx-0 px-0`
        : apply`max-w-screen-${parts[0]} mx-auto px-4 sm:px-6 md:px-8`,
    "form-select-bg": css({
      "background-image":
        `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%239fa6b2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e")`,
      "background-position": "right .5rem center",
      "background-size": "1.5em 1.5em",
      "background-repeat": "no-repeat",
    }),
    "symbolKind":
      apply`rounded-full w-6 h-6 inline-flex items-center justify-center font-medium text-xs leading-none flex-shrink-0`,
    "divide-incl-y": (parts) =>
      css({
        "& > *": {
          "&:first-child": {
            "border-top-width": (parts[0] ?? 1) + "px",
          },
          "border-top-width": "0px",
          "border-bottom-width": (parts[0] ?? 1) + "px",
        },
      }),
    "tag-label":
      apply`inline py-1 px-2 rounded-full leading-none font-medium text-xs`,
    button: ([kind]) => {
      let bg = "";
      let text = "";
      let bgHover = "";
      let border = false;

      switch (kind) {
        case "primary": {
          bg = "tag-blue";
          text = "white";
          bgHover = "[#3587EF]";
          break;
        }
        case "secondary": {
          bg = "default";
          text = "white";
          bgHover = "";
          break;
        }
        case "alternate": {
          bg = "[#F3F3F3]";
          text = "default";
          bgHover = "border";
          break;
        }
        case "outline": {
          bg = "white";
          text = "default";
          bgHover = "ultralight";
          border = true;
          break;
        }
        case "danger": {
          bg = "white";
          text = "[#F00C08]";
          bgHover = "ultralight";
          border = true;
          break;
        }
      }

      return apply`inline-flex items-center gap-2 py-2.5 px-4.5 rounded-md bg-${bg} hover:bg-${bgHover} text-${text} leading-none font-medium ${
        border ? "border border-border" : ""
      }`;
    },
    "icon-button": apply`border border-border rounded p-2 hover:bg-ultralight`,
  },
};

if (IS_BROWSER) {
  const el = document.getElementById("__FRSH_STYLE") as HTMLStyleElement;
  const rules = el.innerText.split("\n");
  const mappings = JSON.parse(rules.pop()!.slice(2, -2));
  const precedences = JSON.parse(rules.pop()!.slice(2, -2));
  const state = [precedences, new Set(rules), new Map(mappings), true];
  const target = el.sheet!;
  const sheet: Sheet = {
    target,
    insert: (rule, index) => target.insertRule(rule, index),
    init(cb) {
      return cb(state.shift());
    },
  };
  config.sheet = sheet;
  twSetup(config);
}
