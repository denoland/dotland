/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function NewsPostPage(): null {
  const { query } = useRouter();

  useEffect(() => {
    location.href = `https://deno.com/blog/${query.post}`
  }, [])

  return null;
}