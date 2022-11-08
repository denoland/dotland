// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { useEffect, useRef, useState } from "preact/hooks";

export default function ScrollInGif() {
  const imgRef = useRef(null);
  const [scrolledIn, setScrolledIn] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      setScrolledIn(entries[0].isIntersecting);
    }, {
      threshold: 0.6,
    });

    if (imgRef.current) observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, [imgRef]);

  return false
    ? <img src="/images/kitty-cat-sandwich.gif" />
    : <img ref={imgRef} src="/images/benchmark.png" />;
}
