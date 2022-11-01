import { Options } from "$fresh/plugins/twind.ts";
import { css } from "twind/css";
import { apply } from "twind";

export default {
  selfURL: import.meta.url,
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
        default: "#232323",
        fresh: "#0CBB3F",
        primary: "#056CF0",
        symbol: "#7B61FF",
        danger: "#F00C08",
        border: "#DDDDDD",
        grayDefault: "#F3F3F3",
        ultralight: "#F8F7F6",

        mainBlue: "#0094FF",
        normalBlue: "#0A4BAB",
        darkBlue: "#000059",
        lightBlue: "#54ADCF",
        veryLightBlue: "#A7DAFF",
        lightWhiteBlue: "#E1F8FF",
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
      borderRadius: {
        "2.5xl": "1.25rem",
      },
      animation: {
        move: "move 6s linear infinite",
      },
    },
  },
  plugins: {
    colorWash: apply`bg-gradient-to-r from-darkBlue to-mainBlue`,

    link:
      apply`text-primary transition duration-75 ease-in-out hover:text-blue-400`,
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
          bg = "primary";
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
          bg = "grayDefault";
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
          text = "danger";
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
} as Options;
