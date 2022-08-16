// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Header } from "@/components/Header.tsx";

export default function MainHeader() {
  const [main, setMain] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) {
        setMain(false);
      } else {
        setMain(true);
      }
    };
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <Header main={main} showLogoText />;
}
