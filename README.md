# Arsen Harutyunyan — Portfolio

My personal portfolio, built as a **desktop operating system in the browser**: open apps from the desktop, drag and resize windows, use the taskbar and start menu, or type commands in the terminal. Recruiters in a hurry can use the **Quick view**, a classic one-page layout with the same content.

## Features

- **Desktop OS UI**: window manager with drag, resize, focus, minimize and maximize; taskbar, start menu and a working terminal (`help`, `skills`, `open projects`, `lang hy`, …)
- **Mobile layout**: a phone-style home screen where apps open full screen
- **Quick view** (`/quick`): everything on one scrolling page
- **Three languages**: English, Russian and Armenian (react-i18next)
- **Light and dark themes** that follow the system setting
- **Contact form**: validated on both ends (Zod and Pydantic), spam honeypot, per-visitor rate limiting, saved to PostgreSQL, with an email notification and an auto-reply

## Tech stack

| Area | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Zustand, Motion, react-rnd, React Hook Form, Zod, react-i18next |
| Backend | Python, FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL (Supabase) |
| Hosting | Vercel (static frontend + Python serverless functions) |
| Testing | pytest |

## Project structure

```
src/
  apps/        each desktop "app" (About, Skills, Experience, Contact, Terminal, …)
  components/  desktop shell (windows, taskbar, start menu), mobile home, shared controls
  data/        typed content: skills, experience, projects, education, interests, contacts
  i18n/        translations (en.json is the source; ru/hy are synced from it)
  store/       Zustand stores for windows and theme
backend/       FastAPI app, models, mailer, tests
api/index.py   Vercel entry point for the backend
```

## Running locally

Requires Node.js 22.12+ and Python 3.12.

```bash
npm install
python -m venv .venv
.venv/Scripts/pip install -r requirements-dev.txt   # macOS/Linux: .venv/bin/pip

cp .env.example .env    # then fill in the values
npm run db:init         # create the database table (once)
npm run dev             # website on :5173 and API on :8000
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Type-check and build the frontend |
| `npm run test:api` | Run the backend tests |
| `npm run i18n:sync` | Add new English keys to the ru/hy files, keeping existing translations |

## Contact

- Email: arsen.harutyunyan088@gmail.com
- LinkedIn: [linkedin.com/in/harutyunyanpy](https://www.linkedin.com/in/harutyunyanpy)
- GitHub: [github.com/harutyunyan88](https://github.com/harutyunyan88)
