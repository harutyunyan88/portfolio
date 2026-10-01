// Course titles and descriptions live in the locale files under `education.items.<id>`.
export type Course = {
  id: 'python' | 'javascript'
  school: string
  start: string
  end: string
  topics: string[]
}

export const COURSES: Course[] = [
  {
    id: 'python',
    school: 'Profit Training Center',
    start: '2020-02',
    end: '2020-09',
    topics: ['Python', 'Django REST Framework', 'Flask', 'React JS', 'MobX'],
  },
  {
    id: 'javascript',
    school: 'BeeOnCode Training Center',
    start: '2019-02',
    end: '2019-05',
    topics: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
  },
]

export const SPOKEN_LANGUAGES = [
  { id: 'hy', level: 'native' },
  { id: 'en', level: 'professional' },
  { id: 'ru', level: 'professional' },
] as const
