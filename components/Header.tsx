/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Link from "next/link";

const Header = ({
  subtitle,
  small,
}: {
  subtitle?: string;
  small?: boolean;
}) => (
  <div className="border-b border-gray-200 bg-gray-50">
    <div
      className={`flex justify-between h-24 sm:h-28 ${
        small ? "max-w-screen-md" : "max-w-screen-lg"
      } mx-auto px-4 sm:px-6 md:px-8`}
    >
      <Link href="/">
        <a className="flex items-center">
          <img
            src="/logo.svg"
            alt="logo"
            className="w-16 h-16 sm:h-20 sm:w-20"
          />
          <div className="mx-4 sm:ml-6 md:ml-8 flex flex-col justify-center">
            <div className="font-bold text-gray-900 leading-8 text-3xl sm:text-4xl tracking-tight">
              Deno
            </div>
            {subtitle && (
              <div className="font-normal text-lg tracking-tight">
                {subtitle}
              </div>
            )}
          </div>
        </a>
      </Link>
    </div>
  </div>
);

export default Header;
