import { LFUCache } from "../src/lfu_cache.ts";
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";

/* storage */
Deno.test("LFU cache set/replace/delete", () => {
  const cache = new LFUCache<number>();
  const key = "justatest";
  cache.set(key, 1);
  assertEquals(cache.get(key), 1);

  // replace
  cache.set(key, 2);
  assertEquals(cache.get(key), 2);

  cache.delete(key);
  assertEquals(cache.get(key), undefined);
});

/* purge */
Deno.test("LFU cache: Purge inactive", () => {
  const cache = new LFUCache<number>(20);
  cache.set("bloat", 1000, { size: 10 });
  cache.set("notBusyBloat", 2000, { size: 3 });
  cache.set("notBusyBloat2", 2000, { size: 3 });
  assertEquals(cache.size, 16);
  for (let i = 0; i < 1000; i++) {
    cache.get("bloat");
    if (i % 3 == 0) {
      cache.get("notBusyBloat");
    }
  }

  const count = cache.purge(6);
  assertEquals(count, 1, "Expected cache to remove 1 entry");

  assertEquals(cache.count, 2, "Expectec cache to have 2 entries");
  assertEquals(cache.size, 13, "Expected cached size to be 13");
});

/* ttl */
Deno.test("LFU cache: ttl", () => {
  const cache = new LFUCache<number>();
  const key = "justatest";
  const expires = new Date(new Date().getTime() - 10000); // 10s in the past
  cache.set(key, 1000, { expiresAt: expires });

  let e = cache.getEntry(key, { returnExpired: true });
  assertEquals(e?.value, 1000);

  e = cache.getEntry(key);
  assertEquals(e, undefined);
});

Deno.test("LFU cache: sweep", () => {
  const cache = new LFUCache<number>();
  const key = "justatest";
  const expires = new Date(new Date().getTime() - 10000); // 10s in the past
  cache.set(key, 1000, { expiresAt: expires });

  assertEquals(cache.count, 1, "Expected cache to have 1 entry");
  cache.sweep();
  assertEquals(cache.count, 0, "Expected cache to be empty");
});
