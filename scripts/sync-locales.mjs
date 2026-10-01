// Adds keys from en.json to the other locale files, keeping existing translations.
// Keys that no longer exist in en.json are removed. Usage: npm run i18n:sync
import { readFileSync, writeFileSync } from 'node:fs'

const dir = new URL('../src/i18n/locales/', import.meta.url)
const read = (lang) => JSON.parse(readFileSync(new URL(`${lang}.json`, dir), 'utf8'))

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

function merge(source, existing) {
  if (isObject(source)) {
    const out = {}
    for (const key of Object.keys(source)) out[key] = merge(source[key], isObject(existing) ? existing[key] : undefined)
    return out
  }
  // Keep the translation when its shape still matches English (string ↔ string, array ↔ array of same length).
  if (Array.isArray(source)) {
    return Array.isArray(existing) && existing.length === source.length ? existing : source
  }
  return typeof existing === typeof source ? existing : source
}

const en = read('en')
for (const lang of ['ru', 'hy']) {
  const merged = merge(en, read(lang))
  writeFileSync(new URL(`${lang}.json`, dir), JSON.stringify(merged, null, 2) + '\n')
  console.log(`✓ ${lang}.json synced`)
}
