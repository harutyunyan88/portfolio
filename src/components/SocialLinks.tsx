import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { SOCIALS } from '../data/profile'

export default function SocialLinks({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <ul className={clsx('flex gap-1', className)}>
      {SOCIALS.map(({ id, icon: Icon, href }) => (
        <li key={id}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={t(`contact.labels.${id}`)}
            title={t(`contact.labels.${id}`)}
            className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-accent-soft hover:text-accent"
          >
            <Icon className="size-5" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}
