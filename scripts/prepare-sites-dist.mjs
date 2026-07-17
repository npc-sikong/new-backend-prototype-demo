import { mkdir, copyFile, writeFile, readFile, readdir } from 'node:fs/promises'
import { extname, resolve } from 'node:path'

const root = process.cwd()
const dist = resolve(root, 'dist')
const hosting = resolve(root, '.openai', 'hosting.json')

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

async function fileEntry(pathname, filePath) {
  const body = await readFile(filePath)
  return {
    body: body.toString('base64'),
    type: contentTypes[extname(filePath)] || 'application/octet-stream',
  }
}

const staticFiles = {
  '/index.html': await fileEntry('/index.html', resolve(dist, 'index.html')),
}

for (const fileName of await readdir(resolve(dist, 'assets'))) {
  staticFiles[`/assets/${fileName}`] = await fileEntry(`/assets/${fileName}`, resolve(dist, 'assets', fileName))
}

const worker = `const STATIC_FILES = ${JSON.stringify(staticFiles)}

function decodeBase64(value) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/index.html'
  if (pathname.startsWith('/new-backend-prototype-demo/')) {
    const stripped = pathname.slice('/new-backend-prototype-demo'.length)
    return normalizePath(stripped || '/')
  }
  return pathname
}

function staticResponse(pathname) {
  const key = normalizePath(pathname)
  const file = STATIC_FILES[key]
  if (!file) return null
  return new Response(decodeBase64(file.body), {
    headers: {
      'content-type': file.type,
      'cache-control': key === '/index.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    },
  })
}

async function assetFetch(request, env) {
  const url = new URL(request.url)
  const embedded = staticResponse(url.pathname)
  if (embedded) return embedded
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/new-backend-prototype-demo/assets/')) {
    return new Response('Not found', { status: 404 })
  }
  const assets = env?.ASSETS
  if (assets?.fetch) {
    const response = await assets.fetch(request)
    if (response.status !== 404) return response
  }
  return staticResponse('/index.html')
}

export default {
  fetch: assetFetch,
}
`

await mkdir(resolve(dist, 'server'), { recursive: true })
await mkdir(resolve(dist, '.openai'), { recursive: true })
await writeFile(resolve(dist, 'server', 'index.js'), worker)
await copyFile(hosting, resolve(dist, '.openai', 'hosting.json'))
