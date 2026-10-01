import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { IconType } from 'react-icons'
import {
  FcBriefcase,
  FcBusinessman,
  FcCommandLine,
  FcContacts,
  FcDocument,
  FcFolder,
  FcGraduationCap,
  FcIdea,
  FcLike,
} from 'react-icons/fc'

export type AppId =
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'interests'
  | 'contact'
  | 'cv'
  | 'terminal'

export type AppDef = {
  id: AppId
  icon: IconType
  size: { width: number; height: number }
  /** Loaded on first open, so the desktop shell stays small. Render it via <AppContent>. */
  component: LazyExoticComponent<ComponentType>
}

// Window titles and labels live in the locale files under `apps.<id>`.
export const APPS: Record<AppId, AppDef> = {
  about: { id: 'about', icon: FcBusinessman, size: { width: 720, height: 620 }, component: lazy(() => import('./AboutApp')) },
  projects: { id: 'projects', icon: FcFolder, size: { width: 900, height: 640 }, component: lazy(() => import('./ProjectsApp')) },
  skills: { id: 'skills', icon: FcIdea, size: { width: 820, height: 640 }, component: lazy(() => import('./SkillsApp')) },
  experience: { id: 'experience', icon: FcBriefcase, size: { width: 780, height: 660 }, component: lazy(() => import('./ExperienceApp')) },
  education: { id: 'education', icon: FcGraduationCap, size: { width: 680, height: 560 }, component: lazy(() => import('./EducationApp')) },
  interests: { id: 'interests', icon: FcLike, size: { width: 760, height: 520 }, component: lazy(() => import('./InterestsApp')) },
  contact: { id: 'contact', icon: FcContacts, size: { width: 900, height: 640 }, component: lazy(() => import('./ContactApp')) },
  cv: { id: 'cv', icon: FcDocument, size: { width: 760, height: 720 }, component: lazy(() => import('./CvApp')) },
  terminal: { id: 'terminal', icon: FcCommandLine, size: { width: 680, height: 420 }, component: lazy(() => import('./TerminalApp')) },
}

export const DESKTOP_ORDER: AppId[] = [
  'about',
  'projects',
  'skills',
  'experience',
  'education',
  'interests',
  'contact',
  'cv',
  'terminal',
]
