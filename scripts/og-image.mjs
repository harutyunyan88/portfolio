// Renders the link-preview image (public/og-image.png, 1200Ã—630) and the iOS home-screen icon
// (public/apple-touch-icon.png). Re-run after changing the text: npm run og
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'node:fs'

const W = 1200
const H = 630
// Profile photo (the original from the CV); public/avatar.webp is the smaller copy used on the site.
const AVATAR = readFileSync(new URL('../backend/assets/avatar.jpg', import.meta.url)).toString('base64')
const SANS = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
const MONO = "Consolas, 'SF Mono', Menlo, monospace"

const blob = (id, cx, cy, r, color) => `
  <radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="${color}" stop-opacity="0.9"/>
    <stop offset="1" stop-color="${color}" stop-opacity="0"/>
  </radialGradient>`

const card = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${blob('b1', 150, 110, 520, '#312e81')}
    ${blob('b2', 1060, 70, 440, '#831843')}
    ${blob('b3', 860, 580, 500, '#164e63')}
    ${blob('b4', 220, 620, 440, '#4c1d95')}
    <linearGradient id="avatar" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6366f1"/>
      <stop offset="0.5" stop-color="#8b5cf6"/>
      <stop offset="1" stop-color="#ec4899"/>
    </linearGradient>
    <clipPath id="window"><rect x="90" y="80" width="1020" height="470" rx="24"/></clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="#0b1020"/>
  <rect width="${W}" height="${H}" fill="url(#b1)"/>
  <rect width="${W}" height="${H}" fill="url(#b2)"/>
  <rect width="${W}" height="${H}" fill="url(#b3)"/>
  <rect width="${W}" height="${H}" fill="url(#b4)"/>

  <!-- Window -->
  <g clip-path="url(#window)">
    <rect x="90" y="80" width="1020" height="470" fill="#111827" fill-opacity="0.88"/>
    <rect x="90" y="80" width="1020" height="54" fill="#1a2235"/>
    <rect x="90" y="134" width="1020" height="1" fill="#ffffff" fill-opacity="0.08"/>
  </g>
  <rect x="90.5" y="80.5" width="1019" height="469" rx="24" fill="none" stroke="#ffffff" stroke-opacity="0.12"/>
  <circle cx="128" cy="107" r="8" fill="#ef4444"/>
  <circle cx="154" cy="107" r="8" fill="#f59e0b"/>
  <circle cx="180" cy="107" r="8" fill="#22c55e"/>
  <text x="600" y="114" text-anchor="middle" font-family="${SANS}" font-size="20" fill="#94a0b8">About Me â€” ArsenOS</text>

  <!-- Avatar: photo inside a gradient ring -->
  <circle cx="230" cy="300" r="96" fill="url(#avatar)"/>
  <clipPath id="photo"><circle cx="230" cy="300" r="90"/></clipPath>
  <image href="data:image/jpeg;base64,${AVATAR}" x="140" y="210" width="180" height="180" clip-path="url(#photo)" preserveAspectRatio="xMidYMid slice"/>

  <!-- Text -->
  <text x="364" y="268" font-family="${SANS}" font-size="64" font-weight="700" fill="#e5e9f2">Arsen Harutyunyan</text>
  <text x="366" y="322" font-family="${SANS}" font-size="34" font-weight="600" fill="#818cf8">Full Stack Developer</text>
  <text x="366" y="376" font-family="${SANS}" font-size="26" fill="#94a0b8">Python Â· Django Â· FastAPI Â· React Â· TypeScript</text>

  <!-- Terminal line -->
  <rect x="130" y="440" width="940" height="66" rx="14" fill="#0d1117" stroke="#ffffff" stroke-opacity="0.06"/>
  <text x="158" y="482" font-family="${MONO}" font-size="24">
    <tspan fill="#34d399">arsen@portfolio:~$</tspan><tspan fill="#e2e8f0"> open portfolio</tspan><tspan fill="#34d399">â–Œ</tspan>
  </text>
  <text x="1046" y="482" text-anchor="end" font-family="${SANS}" font-size="22" fill="#94a0b8">Yerevan, Armenia</text>
</svg>`

const render = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: { loadSystemFonts: true } }).render().asPng()

writeFileSync(new URL('../public/og-image.png', import.meta.url), render(card, W))
console.log('âœ“ public/og-image.png')

// iOS ignores SVG favicons for the home screen; it needs a PNG.
const favicon = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8')
writeFileSync(new URL('../public/apple-touch-icon.png', import.meta.url), render(favicon, 180))
console.log('âœ“ public/apple-touch-icon.png')
