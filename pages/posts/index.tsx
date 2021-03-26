/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */
import React, { useEffect } from "react";

function PostsIndexPage(): React.ReactElement | null {
  useEffect(() => {
    location.href = "https://deno.com/blog";
  }, []);
  return null;
}

export default PostsIndexPage;