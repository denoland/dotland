const { files } = await Deno.emit("/a.ts", {
  bundle: "iife",
  sources: {
    "/a.ts": `import { b } from "./b.ts";
        console.log(b);`,
    "/b.ts": `export const b = "b";`,
  },
});
console.log(files["deno:///bundle.js"]);
