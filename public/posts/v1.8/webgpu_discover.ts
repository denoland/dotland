// Run with `deno run --unstable https://deno.land/posts/v1.8/webgpu_discover.ts`

// Try to get an adapter from the user agent.
const adapter = await navigator.gpu.requestAdapter();
if (adapter) {
  // Print out some basic details about the adapter.
  console.log(`Found adapter: ${adapter.name}`);
  const features = [...adapter.features.values()];
  console.log(`Supported features: ${features.join(", ")}`);
} else {
  console.error("No adapter found");
}
