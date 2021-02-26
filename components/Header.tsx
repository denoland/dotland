/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Transition from "./Transition";

function Header({
  subtitle,
  widerContent,
}: {
  subtitle?: string;
  widerContent?: boolean;
}): React.ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [toggleThemeCount, setToggleThemeCount] = useState(0);

  useEffect(() => {
    if (toggleThemeCount < 1) {
      const themeUser =
        localStorage.getItem("theme") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      setTheme(themeUser);
      setToggleThemeCount(toggleThemeCount + 1);
    } else {
      localStorage.setItem("theme", theme);
      console.log(localStorage.getItem("theme"));
    }

    const htmlTag = document.getElementsByTagName("html")[0];
    htmlTag.className = theme;
    htmlTag.style.setProperty("color-scheme", theme);
    htmlTag.setAttribute("data-color-mode", theme);
    htmlTag.setAttribute("data-dark-theme", "dark");
    htmlTag.setAttribute("data-light-theme", "light");
  }, [theme]);

  return (
    <div className="relative py-6 z-10">
      <nav
        className={`mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 ${
          widerContent ? "max-w-screen-xl" : "max-w-screen-lg lg:p-0"
        }`}
      >
        <Link href="/">
          <a className="flex items-center">
            <img
              className="h-10 w-auto sm:h-12 my-2"
              src="/logo.svg"
              alt="Deno Logo"
            />
            <div className="ml-5 flex flex-col justify-center">
              <div className="font-bold text-gray-900 leading-tight text-2xl sm:text-3xl tracking-tight dark:text-gray-200">
                Deno
              </div>
              {subtitle && (
                <div className="font-normal text-sm sm:text-lg leading-tight tracking-tight dark:text-gray-200">
                  {subtitle}
                </div>
              )}
            </div>
          </a>
        </Link>
        <div className="-mr-2 flex items-center lg:hidden">
          <button
            className="mx-1 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:focus:text-gray-300"
            style={{ lineHeight: 0 }}
            onClick={() => {
              theme == "light" ? setTheme("dark") : null;
              theme == "dark" ? setTheme("light") : null;
            }}
          >
            <span className="sr-only">Toggle theme</span>
            {theme == "light" ? (
              <svg
                className="h-6 w-6 inline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : null}
            {theme == "dark" ? (
              <svg
                className="h-6 w-6 inline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : null}
          </button>
          <button
            type="button"
            className="mx-1 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:focus:text-gray-300"
            onClick={() => setMenuOpen(true)}
          >
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <title>Menu | Deno</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex md:ml-10 items-end">
          <Link href="/#installation">
            <a className="font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out dark:text-gray-400 dark:hover:text-gray-300">
              Install
            </a>
          </Link>
          <Link href="/manual">
            <a className="ml-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out dark:text-gray-400 dark:hover:text-gray-300">
              Manual
            </a>
          </Link>
          <Link href="/posts">
            <a className="ml-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out dark:text-gray-400 dark:hover:text-gray-300">
              News
            </a>
          </Link>
          <a
            href="https://doc.deno.land/builtin/stable"
            className="ml-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out dark:text-gray-400 dark:hover:text-gray-300"
          >
            Runtime API
          </a>
          <Link href="/std">
            <a className="ml-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out dark:text-gray-400 dark:hover:text-gray-300">
              Standard Library
            </a>
          </Link>
          <Link href="/x">
            <a className="ml-10 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out dark:text-gray-400 dark:hover:text-gray-300">
              Third Party Modules
            </a>
          </Link>
          <button
            className="ml-10 text-gray-500 hover:text-gray-900 focus:outline-none transition duration-150 ease-in-out dark:text-gray-400 dark:hover:text-gray-300"
            style={{ lineHeight: 0 }}
            onClick={() => {
              theme == "light" ? setTheme("dark") : null;
              theme == "dark" ? setTheme("light") : null;
            }}
          >
            <span className="sr-only">Toggle theme</span>
            {theme == "light" ? (
              <svg
                className="h-6 w-6 inline"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : null}
            {theme == "dark" ? (
              <svg
                className="h-6 w-6 inline"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : null}
          </button>
          <a
            href="https://github.com/denoland"
            className="ml-3 text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out dark:text-gray-400 dark:hover:text-gray-300"
            style={{ lineHeight: 0 }}
          >
            <span className="sr-only">GitHub</span>
            <svg
              className="h-6 w-6 inline"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Github | Deno</title>
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </nav>

      <Transition
        show={menuOpen}
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right lg:hidden">
          <div className="rounded-lg shadow-md">
            <div className="rounded-lg bg-white shadow-xs overflow-hidden dark:bg-gray-800">
              <div className="px-5 pt-4 flex items-center justify-between">
                <Link href="/">
                  <a className="flex items-center">
                    <img
                      className="h-10 w-auto sm:h-12 my-2"
                      src="/logo.svg"
                      alt=""
                    />
                    <div className="ml-5 flex flex-col justify-center">
                      <div className="font-bold text-gray-900 leading-tight text-2xl sm:text-3xl tracking-tight dark:text-gray-100">
                        Deno
                      </div>
                      {subtitle && (
                        <div className="font-normal text-sm sm:text-lg leading-tight tracking-tight">
                          {subtitle}
                        </div>
                      )}
                    </div>
                  </a>
                </Link>{" "}
                <div className="-mr-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out dark:text-gray-500dark:hover:text-gray-300 dark:hover:bg-gray-900"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg
                      className="h-6 w-6"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-2 pt-4 pb-3">
                <Link href="/#installation">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-900 dark:focus:text-gray-300 dark:focus:bg-gray-900">
                    Install
                  </a>
                </Link>
                <Link href="/manual">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-900 dark:focus:text-gray-300 dark:focus:bg-gray-900">
                    Manual
                  </a>
                </Link>
                <Link href="/posts">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-900 dark:focus:text-gray-300 dark:focus:bg-gray-900">
                    News
                  </a>
                </Link>
                <a
                  href="https://doc.deno.land/builtin/stable"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-900 dark:focus:text-gray-300 dark:focus:bg-gray-900"
                >
                  Runtime API
                </a>
                <Link href="/std">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-900 dark:focus:text-gray-300 dark:focus:bg-gray-900">
                    Standard Library
                  </a>
                </Link>
                <Link href="/x">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-900 dark:focus:text-gray-300 dark:focus:bg-gray-900">
                    Third Party Modules
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default Header;
