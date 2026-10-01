// Text (role, summary, bullets) lives in the locale files under `experience.items.<id>`.
export type Experience = {
  id: 'profit' | 'freelance'
  company: string
  type: 'fullTime' | 'freelance'
  /** 'YYYY-MM'; `end: null` means the current job. */
  start: string
  end: string | null
  tech: string[]
}

export const EXPERIENCE: Experience[] = [
  {
    id: 'freelance',
    company: 'Freelance Project',
    type: 'freelance',
    start: '2026-05',
    end: '2026-08',
    tech: ['React.js', 'TypeScript', 'Vite', 'MUI', 'Redux Toolkit', 'RTK Query', 'React Hook Form', 'Zod', 'i18next', 'Azure Static Web Apps'],
  },
  {
    id: 'profit',
    company: 'Profit Development Company',
    type: 'fullTime',
    start: '2020-10',
    end: null,
    tech: ['React.js', 'Redux', 'MobX', 'Python', 'Django', 'Django Ninja', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Pandas', 'FPDF', 'JWT'],
  },
]
