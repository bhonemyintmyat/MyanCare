/*
 * Font wiring guards: the three places that reference font files
 * (public/fonts/, fonts.css, index.html preloads) can drift apart
 * silently — a renamed file would just 404 and Burmese would fall
 * back to system fonts. These tests fail loudly instead.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(__dirname, '..', '..')
const fontsDir = join(root, 'public', 'fonts')

const fontsCss = readFileSync(join(root, 'src', 'styles', 'fonts.css'), 'utf8')
const indexHtml = readFileSync(join(root, 'index.html'), 'utf8')
const availableFiles = readdirSync(fontsDir)

// Pulls every /fonts/*.woff2 URL out of a text file
function fontUrls(text) {
  return [...text.matchAll(/\/fonts\/([\w-]+\.woff2)/g)].map((m) => m[1])
}

test('every font URL in fonts.css points at a real file', () => {
  const referenced = fontUrls(fontsCss)
  expect(referenced.length).toBeGreaterThan(0)
  for (const file of referenced) {
    expect(availableFiles).toContain(file)
  }
})

test('every preload in index.html points at a real file', () => {
  const preloaded = fontUrls(indexHtml)
  expect(preloaded.length).toBeGreaterThan(0)
  for (const file of preloaded) {
    expect(availableFiles).toContain(file)
  }
})

test('preloads cover exactly the Noto weights the CSS declares', () => {
  // Padauk is a fallback and must NOT be preloaded; every declared
  // Noto weight must be. Catches "added a weight but forgot the
  // preload" and "preloading a fallback nobody downloads".
  const declaredNoto = fontUrls(fontsCss).filter((f) => f.startsWith('noto'))
  const preloaded = fontUrls(indexHtml)
  expect(preloaded.sort()).toEqual([...new Set(declaredNoto)].sort())
})
