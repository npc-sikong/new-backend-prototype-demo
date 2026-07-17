import { mkdir, copyFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = process.cwd()
const dist = resolve(root, 'dist')
const hosting = resolve(root, '.openai', 'hosting.json')
const worker = `async function assetFetch(request, env) {
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
`

await mkdir(resolve(dist, 'server'), { recursive: true })
await mkdir(resolve(dist, '.openai'), { recursive: true })
await writeFile(resolve(dist, 'server', 'index.js'), worker)
await copyFile(hosting, resolve(dist, '.openai', 'hosting.json'))
