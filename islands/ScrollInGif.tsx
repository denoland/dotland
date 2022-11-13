// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { useEffect, useRef, useState } from "preact/hooks";

export default function ScrollInGif({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
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

  return scrolledIn
    ? (
      <img
        class="p-3.5 lg:(py-11 px-10)"
        ref={imgRef}
        src={src + ".gif"}
        alt={alt}
      />
    )
    : (
      <img
        class="p-3.5 lg:(py-11 px-10)"
        ref={imgRef}
        src={src + ".png"}
        alt={alt}
        aria-hidden
      />
    );
}
