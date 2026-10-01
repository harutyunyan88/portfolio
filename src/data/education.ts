import content from './content.json'

// Course titles and descriptions live in the locale files under `education.items.<id>`.
export type Course = {
  id: 'python' | 'javascript'
  school: string
  start: string
  end: string
  topics: string[]
}

export const COURSES = content.courses as Course[]

export const SPOKEN_LANGUAGES = content.spokenLanguages as { id: 'hy' | 'en' | 'ru'; level: 'native' | 'professional' }[]
