// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
export function unlink(path: string | URL, callback: (err?: Error) => void) {
  if (!callback) throw new Error("No callback function supplied");
  Deno.remove(path).then((_) => callback(), callback);
}

export function unlinkSync(path: string | URL) {
  Deno.removeSync(path);
}
