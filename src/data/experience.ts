import content from './content.json'

// Text (role, location, bullets) lives in the locale files under `experience.items.<id>`.
export type Experience = {
  id: 'profit' | 'freelance'
  company: string
  type: 'fullTime' | 'freelance'
  /** 'YYYY-MM'; `end: null` means the current job. */
  start: string
  end: string | null
  tech: string[]
}

export const EXPERIENCE = content.experience as Experience[]
