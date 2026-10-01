import type { IconType } from 'react-icons'
import { FiBriefcase, FiCpu, FiEdit3, FiGift, FiMonitor } from 'react-icons/fi'
import content from './content.json'

type ProjectId = 'propertyManagement' | 'aiBlogGenerator' | 'giftsMarketplace' | 'aiLab' | 'portfolio'

// Text (title, description, highlights) lives in the locale files under `projects.items.<id>`.
export type Project = {
  id: ProjectId
  kind: 'client' | 'personal' | 'learning'
  /** The part of the project I worked on. */
  role: 'frontend' | 'fullstack'
  icon: IconType
  /** Tailwind gradient classes for the card banner, used until there are screenshots. */
  gradient: string
  tech: string[]
  links?: { github?: string; live?: string }
}

const LOOK: Record<ProjectId, Pick<Project, 'icon' | 'gradient'>> = {
  propertyManagement: { icon: FiBriefcase, gradient: 'from-sky-500 via-indigo-500 to-violet-600' },
  aiBlogGenerator: { icon: FiEdit3, gradient: 'from-emerald-500 via-teal-500 to-cyan-600' },
  giftsMarketplace: { icon: FiGift, gradient: 'from-amber-400 via-orange-500 to-rose-500' },
  aiLab: { icon: FiCpu, gradient: 'from-orange-400 via-amber-500 to-yellow-500' },
  portfolio: { icon: FiMonitor, gradient: 'from-fuchsia-500 via-pink-500 to-orange-400' },
}

export const PROJECTS: Project[] = content.projects.map((p) => ({
  ...p,
  id: p.id as ProjectId,
  kind: p.kind as Project['kind'],
  role: p.role as Project['role'],
  ...LOOK[p.id as ProjectId],
}))
