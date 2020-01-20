export async function handleAPIRequest(request) {
  const url = new URL(request.url);

  if (url.pathname == "/api/versions") {
    return handleVersionRequest(request);
  }

  return new Response("API method not found: " + url.pathname, {
    status: 404,
    statusText: "Not Found"
  });
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

async function handleVersionRequest(request) {
  const { method } = request;
  if (method === "OPTIONS") {
    return new Response("200 OK", {
      status: 200,
      statusText: "OK",
      headers: corsHeaders
    });
  }
  // HEAD requests are handled by Cloudflare Workers
  if (method !== "GET" && method !== "HEAD") {
    return new Response("405 Method Not Allowed", {
      status: 405,
      statusText: "Method Not Allowed",
      headers: corsHeaders
    });
  }

  let matches = [];
  try {
    // Get versions from Github and cache them for 120 seconds if the request was a success.
    const resp = await fetch("https://github.com/denoland/deno/releases.atom", {
      cf: { cacheTtlByStatus: { "200-299": 120, "400-599": 1 } }
    });
    if (!resp.ok) throw new Error("Bad response from Github.");
    const atom = await resp.text();
    matches = [...atom.matchAll(/<title>v(.*)<\/title>/g)];
    if (!matches) throw new Error("No matches were found.");
  } catch (e) {
    return new Response("Failed to fetch releases from GitHub", {
      status: 502,
      statusText: "Bad Gateway",
      headers: corsHeaders
    });
  }
  const versions = matches.map(match => ({
    tag: "v" + match[1],
    url: "https://github.com/denoland/deno/releases/tag/v" + match[1]
  }));
  return new Response(JSON.stringify(versions), {
    status: 200,
    statusText: "OK",
    headers: { "content-type": "application/json", ...corsHeaders }
  });
}
