/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { useState, useEffect } from "react";

export function getOS() {
  const oses = ["mac", "linux", "win"] as const;
  const os = oses.find(
    (v) => navigator.userAgent.toLowerCase().indexOf(v) >= 0
  );
  return os === undefined ? null : os;
}

export function useOS() {
  const [os, setOS] = useState<ReturnType<typeof getOS>>();
  useEffect(() => {
    setOS(getOS());
  }, []);
  return os;
}
