import { proxy } from '../src/registry_utils'

// const REMOTE_URL = "https://deno.land";
const REMOTE_URL = 'https://denoland.netlify.com'

addEventListener('fetch', event => {
  console.log('proxy', proxy)
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const accept = request.headers.get('accept')
  // console.log("accept header", accept);
  const isHtml = accept && accept.indexOf('html') >= 0

  const url = new URL(request.url)
  // console.log('request.url', url.pathname);
  const maybeProxyElsewhere =
    url.pathname.startsWith('/std') || url.pathname.startsWith('/x')

  if (isHtml) {
    return redirect(url, request)
  }

  if (!maybeProxyElsewhere) {
    return redirect(url, request)
  }

  console.log('serve up text?', url.pathname)
  let { entry, path } = proxy(url.pathname)
  if (!entry) {
    return new Response('Not in database.json ' + url.pathname, {
      status: 404,
      statusText: 'Not Found',
      headers: { 'content-type': 'text/plain' },
    })
  }
  const rUrl = `${entry.url}${path}`
  console.log('text proxy', rUrl)
  return fetch(rUrl)
}

function redirect(url, request) {
  const init = {
    method: request.method,
    headers: request.headers,
  }
  const urlR = REMOTE_URL + url.pathname
  console.log('url', urlR)
  console.log(`Proxy ${url} to ${urlR}`)
  const modifiedRequest = new Request(urlR, init)
  return fetch(modifiedRequest)
}
