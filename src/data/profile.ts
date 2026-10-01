import type { IconType } from 'react-icons'
import { FaLinkedin } from 'react-icons/fa6'
import { FiMail, FiPhone } from 'react-icons/fi'
import { SiGithub, SiTelegram } from 'react-icons/si'
import content from './content.json'

const [startYear, startMonth] = content.careerStart.split('-').map(Number)
export const CAREER_START = new Date(startYear, startMonth - 1)

/** Whole years since CAREER_START, counted in calendar months (so October 2026 is exactly 6). */
export const yearsOfExperience = (now = new Date()) => {
  const months = (now.getFullYear() - CAREER_START.getFullYear()) * 12 + (now.getMonth() - CAREER_START.getMonth())
  return Math.floor(months / 12)
}

type ContactId = 'email' | 'phone' | 'telegram' | 'github' | 'linkedin'

export type ContactLink = {
  id: ContactId
  icon: IconType
  value: string
  href: string
}

const ICONS: Record<ContactId, IconType> = {
  email: FiMail,
  phone: FiPhone,
  telegram: SiTelegram,
  github: SiGithub,
  linkedin: FaLinkedin,
}

export const CONTACTS: ContactLink[] = content.contacts.map((c) => ({
  ...c,
  id: c.id as ContactId,
  icon: ICONS[c.id as ContactId],
}))

export const SOCIALS = CONTACTS.filter((c) => c.id === 'github' || c.id === 'linkedin' || c.id === 'telegram')
