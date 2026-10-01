import type { IconType } from 'react-icons'
import {
  SiBootstrap,
  SiClaude,
  SiCss,
  SiDjango,
  SiDocker,
  SiFastapi,
  SiFlask,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiGitlab,
  SiHtml5,
  SiI18Next,
  SiJavascript,
  SiJinja,
  SiJira,
  SiJsonwebtokens,
  SiMongodb,
  SiMui,
  SiMysql,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiReact,
  SiReacthookform,
  SiRedux,
  SiMobx,
  SiSass,
  SiSqlalchemy,
  SiStyledcomponents,
  SiTailwindcss,
  SiTrello,
  SiTypescript,
  SiVite,
  SiZod,
} from 'react-icons/si'
import { TbApi, TbTestPipe } from 'react-icons/tb'
import { VscAzure } from 'react-icons/vsc'

export type Skill = {
  name: string
  icon: IconType
  /** Brand colour. Omitted for black/white logos so they follow the theme's text colour. */
  color?: string
}

export type SkillGroup = {
  id: 'frontend' | 'backend' | 'databases' | 'apis' | 'tools'
  skills: Skill[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'frontend',
    skills: [
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'React.js', icon: SiReact, color: '#61DAFB' },
      { name: 'Redux / RTK Query', icon: SiRedux, color: '#764ABC' },
      { name: 'MobX', icon: SiMobx, color: '#FF9955' },
      { name: 'React Hook Form', icon: SiReacthookform, color: '#EC5990' },
      { name: 'Zod', icon: SiZod, color: '#3E67B1' },
      { name: 'i18next', icon: SiI18Next, color: '#26A69A' },
      { name: 'MUI', icon: SiMui, color: '#007FFF' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'SCSS', icon: SiSass, color: '#CC6699' },
      { name: 'Styled Components', icon: SiStyledcomponents, color: '#DB7093' },
      { name: 'Vite', icon: SiVite, color: '#646CFF' },
      { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS', icon: SiCss, color: '#663399' },
      { name: 'Bootstrap', icon: SiBootstrap, color: '#7952B3' },
    ],
  },
  {
    id: 'backend',
    skills: [
      { name: 'Python', icon: SiPython, color: '#3776AB' },
      { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
      { name: 'Django', icon: SiDjango, color: '#44B78B' },
      { name: 'Django REST Framework', icon: SiDjango, color: '#A30000' },
      { name: 'Flask', icon: SiFlask },
      { name: 'SQLAlchemy', icon: SiSqlalchemy, color: '#D71F00' },
      { name: 'Jinja2', icon: SiJinja, color: '#B41717' },
      { name: 'Pandas', icon: SiPandas, color: '#150458' },
    ],
  },
  {
    id: 'databases',
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
      { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
      { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
    ],
  },
  {
    id: 'apis',
    skills: [
      { name: 'REST APIs', icon: TbApi, color: '#6366F1' },
      { name: 'JWT Auth', icon: SiJsonwebtokens, color: '#D63AFF' },
      { name: 'Unit & Integration Testing', icon: TbTestPipe, color: '#16A34A' },
    ],
  },
  {
    id: 'tools',
    skills: [
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'GitHub', icon: SiGithub },
      { name: 'GitLab', icon: SiGitlab, color: '#FC6D26' },
      { name: 'GitHub Actions', icon: SiGithubactions, color: '#2088FF' },
      { name: 'Docker', icon: SiDocker, color: '#2496ED' },
      { name: 'Azure Static Web Apps', icon: VscAzure, color: '#0078D4' },
      { name: 'Jira', icon: SiJira, color: '#0052CC' },
      { name: 'Trello', icon: SiTrello, color: '#0079BF' },
      { name: 'Claude Code', icon: SiClaude, color: '#D97757' },
    ],
  },
]
