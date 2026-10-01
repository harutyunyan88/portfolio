// Runs the project's virtualenv Python with the given arguments, on Windows and macOS/Linux alike.
// Usage from package.json: node scripts/python.mjs -m uvicorn backend.main:app --reload
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const python = process.platform === 'win32' ? '.venv/Scripts/python.exe' : '.venv/bin/python'

if (!existsSync(python)) {
  console.error('Python virtualenv not found. Create it with:\n  python -m venv .venv\n  .venv/Scripts/pip install -r requirements-dev.txt')
  process.exit(1)
}

const { status } = spawnSync(python, process.argv.slice(2), { stdio: 'inherit' })
process.exit(status ?? 1)
