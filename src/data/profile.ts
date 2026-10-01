import type { IconType } from 'react-icons'
import { FaLinkedin } from 'react-icons/fa6'
import { FiMail, FiPhone } from 'react-icons/fi'
import { SiGithub, SiTelegram } from 'react-icons/si'

export const CAREER_START = new Date(2020, 9) // October 2020

export const yearsOfExperience = () =>
  Math.floor((Date.now() - CAREER_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000))

export type ContactLink = {
  id: 'email' | 'phone' | 'telegram' | 'github' | 'linkedin'
  icon: IconType
  value: string
  href: string
}

export const CONTACTS: ContactLink[] = [
  { id: 'email', icon: FiMail, value: 'arsen.harutyunyan088@gmail.com', href: 'mailto:arsen.harutyunyan088@gmail.com' },
  { id: 'phone', icon: FiPhone, value: '+374 98 82 23 29', href: 'tel:+37498822329' },
  { id: 'telegram', icon: SiTelegram, value: '@Harutyunyan_a88', href: 'https://t.me/Harutyunyan_a88' },
  { id: 'github', icon: SiGithub, value: 'github.com/harutyunyan88', href: 'https://github.com/harutyunyan88' },
  { id: 'linkedin', icon: FaLinkedin, value: 'linkedin.com/in/harutyunyanpy', href: 'https://www.linkedin.com/in/harutyunyanpy' },
]

export const SOCIALS = CONTACTS.filter((c) => c.id === 'github' || c.id === 'linkedin' || c.id === 'telegram')
