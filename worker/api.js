export async function handleAPIRequest(request) {
  const url = new URL(request.url);
  const accept = request.headers.get("accept");
  const isJSON = accept && accept.indexOf("application/json") >= 0;

  if (!isJSON) {
    return new Response(
      "The client does not accept 'application/json' content",
      {
        status: 400,
        statusText: "Bad Request"
      }
    );
  }

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
