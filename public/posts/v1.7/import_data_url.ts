// Run with `deno run https://deno.land/posts/v1.7/import_data_url.ts`
import * as a from "data:application/typescript;base64,ZXhwb3J0IGNvbnN0IGEgPSAiYSI7CgpleHBvcnQgZW51bSBBIHsKICBBLAogIEIsCiAgQywKfQo=";

console.log(a.a);
console.log(a.A);
console.log(a.A.A);
