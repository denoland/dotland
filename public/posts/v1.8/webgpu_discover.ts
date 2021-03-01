// Run with `deno run https://deno.land/posts/v1.8/webgpu_discover.ts`

// Try to get an adapter from the user agent. If this fails, return an error.
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
  console.error("No adapter found");
  Deno.exit(1);
}

// Print out some basic details about the adapter.
console.log(`Found adapter: ${adapter.name}`);
const features = [...adapter.features.values()];
console.log(`Supported features: ${features.join(", ")}`);
