import type { IconType } from 'react-icons'
import {
  SiAnthropic,
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
  SiMobx,
  SiMongodb,
  SiMui,
  SiMysql,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiReact,
  SiReacthookform,
  SiRedux,
  SiSass,
  SiSqlalchemy,
  SiStyledcomponents,
  SiTailwindcss,
  SiTrello,
  SiTypescript,
  SiVite,
  SiZod,
} from 'react-icons/si'
import { TbApi, TbCode, TbDatabaseSearch, TbMessageChatbot, TbRobot, TbTestPipe, TbVectorTriangle } from 'react-icons/tb'
import { VscAzure } from 'react-icons/vsc'
import content from './content.json'

export type Skill = {
  name: string
  icon: IconType
  /** Brand colour. Omitted for black/white logos so they follow the theme's text colour. */
  color?: string
}

export type SkillGroup = {
  id: 'frontend' | 'backend' | 'databases' | 'apis' | 'ai' | 'tools'
  skills: Skill[]
}

// Which skills exist (and in which group) is defined in content.json; this only adds the logos.
const STYLES: Record<string, Omit<Skill, 'name'>> = {
  JavaScript: { icon: SiJavascript, color: '#F7DF1E' },
  TypeScript: { icon: SiTypescript, color: '#3178C6' },
  'React.js': { icon: SiReact, color: '#61DAFB' },
  'Redux / RTK Query': { icon: SiRedux, color: '#764ABC' },
  MobX: { icon: SiMobx, color: '#FF9955' },
  'React Hook Form': { icon: SiReacthookform, color: '#EC5990' },
  Zod: { icon: SiZod, color: '#3E67B1' },
  i18next: { icon: SiI18Next, color: '#26A69A' },
  MUI: { icon: SiMui, color: '#007FFF' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4' },
  SCSS: { icon: SiSass, color: '#CC6699' },
  'Styled Components': { icon: SiStyledcomponents, color: '#DB7093' },
  Vite: { icon: SiVite, color: '#646CFF' },
  HTML5: { icon: SiHtml5, color: '#E34F26' },
  CSS: { icon: SiCss, color: '#663399' },
  Bootstrap: { icon: SiBootstrap, color: '#7952B3' },
  Python: { icon: SiPython, color: '#3776AB' },
  FastAPI: { icon: SiFastapi, color: '#009688' },
  Django: { icon: SiDjango, color: '#44B78B' },
  'Django REST Framework': { icon: SiDjango, color: '#A30000' },
  Flask: { icon: SiFlask },
  SQLAlchemy: { icon: SiSqlalchemy, color: '#D71F00' },
  Jinja2: { icon: SiJinja, color: '#B41717' },
  Pandas: { icon: SiPandas, color: '#150458' },
  PostgreSQL: { icon: SiPostgresql, color: '#4169E1' },
  MySQL: { icon: SiMysql, color: '#4479A1' },
  MongoDB: { icon: SiMongodb, color: '#47A248' },
  'REST APIs': { icon: TbApi, color: '#6366F1' },
  'JWT Auth': { icon: SiJsonwebtokens, color: '#D63AFF' },
  'Unit & Integration Testing': { icon: TbTestPipe, color: '#16A34A' },
  Git: { icon: SiGit, color: '#F05032' },
  GitHub: { icon: SiGithub },
  GitLab: { icon: SiGitlab, color: '#FC6D26' },
  'GitHub Actions': { icon: SiGithubactions, color: '#2088FF' },
  Docker: { icon: SiDocker, color: '#2496ED' },
  'Azure Static Web Apps': { icon: VscAzure, color: '#0078D4' },
  Jira: { icon: SiJira, color: '#0052CC' },
  Trello: { icon: SiTrello, color: '#0079BF' },
  'Claude API': { icon: SiAnthropic },
  'Prompt Engineering': { icon: TbMessageChatbot, color: '#D97757' },
  RAG: { icon: TbDatabaseSearch, color: '#0EA5E9' },
  Embeddings: { icon: TbVectorTriangle, color: '#8B5CF6' },
  pgvector: { icon: SiPostgresql, color: '#4169E1' },
  'Tool Use & Agents': { icon: TbRobot, color: '#10B981' },
  'Claude Code': { icon: SiClaude, color: '#D97757' },
}

export const SKILL_GROUPS: SkillGroup[] = content.skillGroups.map((group) => ({
  id: group.id as SkillGroup['id'],
  skills: group.skills.map((name) => ({ name, ...(STYLES[name] ?? { icon: TbCode }) })),
}))
