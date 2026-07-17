async function assetFetch(request, env) {
  const url = new URL(request.url)
  const assets = env?.ASSETS
  if (!assets?.fetch) {
    return new Response('Sites asset binding is not available.', { status: 500 })
  }
  const response = await assets.fetch(request)
  if (response.status !== 404 || url.pathname.startsWith('/assets/')) return response
  return assets.fetch(new Request(new URL('/index.html', url.origin), request))
}

export default {
  fetch: assetFetch,
}
