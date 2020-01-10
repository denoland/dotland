export async function handleAPIRequest(request) {
  const url = new URL(request.url);

  if (url.pathname == "/api/versions") {
    const resp = await fetch("https://github.com/denoland/deno/releases.atom");
    const atom = await resp.text();
    const matches = [...atom.matchAll(/<title>v(.*)<\/title>/g)];
    if (!matches) {
      return new Response("Failed to fetch releases from GitHub", {
        status: 500,
        statusText: "Internal Server Error"
      });
    }
    const versions = matches.map(match => ({
      tag: "v" + match[1],
      url: "https://github.com/denoland/deno/releases/tag/v" + match[1]
    }));
    return new Response(JSON.stringify(versions), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }

  return new Response("API method not found: " + url.pathname, {
    status: 404,
    statusText: "Not Found"
  });
}
