import type { IconType } from 'react-icons'
import { FiBriefcase, FiMonitor } from 'react-icons/fi'

// Text (title, description, highlights) lives in the locale files under `projects.items.<id>`.
export type Project = {
  id: 'propertyManagement' | 'portfolio'
  kind: 'client' | 'personal'
  icon: IconType
  /** Tailwind gradient classes for the card banner, used until there are screenshots. */
  gradient: string
  tech: string[]
  links?: { github?: string; live?: string }
}

export const PROJECTS: Project[] = [
  {
    id: 'propertyManagement',
    kind: 'client',
    icon: FiBriefcase,
    gradient: 'from-sky-500 via-indigo-500 to-violet-600',
    tech: ['React.js', 'TypeScript', 'Vite', 'MUI', 'RTK Query', 'React Hook Form', 'Zod', 'Azure'],
  },
  {
    id: 'portfolio',
    kind: 'personal',
    icon: FiMonitor,
    gradient: 'from-fuchsia-500 via-pink-500 to-orange-400',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'i18next', 'FastAPI', 'PostgreSQL', 'Vercel'],
    links: { github: 'https://github.com/harutyunyan88' },
  },
]
