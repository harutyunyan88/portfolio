import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Link previews need absolute URLs. Vercel sets VERCEL_PROJECT_PRODUCTION_URL to the production
// domain (a custom domain once one is added); locally we fall back to the current Vercel address.
const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://portfolio-phi-lilac-83.vercel.app'

const siteUrl = (): Plugin => ({
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrl()],
  server: {
    // Locally the FastAPI backend runs on :8000 (npm run dev:api); on Vercel both share one domain.
    proxy: { '/api': 'http://127.0.0.1:8000' },
  },
})
