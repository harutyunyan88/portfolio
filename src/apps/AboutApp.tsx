import { useTranslation } from 'react-i18next'
import { FiDownload, FiSend } from 'react-icons/fi'
import Avatar from '../components/Avatar'
import SocialLinks from '../components/SocialLinks'
import { yearsOfExperience } from '../data/profile'
import { cvUrl } from '../lib/constants'
import { useAppHost } from './AppHost'

export default function AboutApp() {
  const { t } = useTranslation()
  const { openApp } = useAppHost()
  const years = yearsOfExperience()
  const bio = t('about.bio', { returnObjects: true, years }) as string[]

  const facts = [
    { label: t('about.facts.experience'), value: t('about.facts.experienceValue', { years }) },
    { label: t('about.facts.location'), value: t('profile.location') },
    { label: t('about.facts.focus'), value: t('about.facts.focusValue') },
    { label: t('about.facts.languages'), value: t('about.facts.languagesValue') },
  ]

  return (
    <div className="@container p-5 sm:p-7">
      <div className="flex flex-col items-center gap-5 text-center @lg:flex-row @lg:items-start @lg:text-left">
        <Avatar className="size-28 text-4xl shadow-xl" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-accent">{t('about.greeting')}</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight">{t('profile.name')}</h2>
          <p className="mt-1 text-muted">{t('profile.role')}</p>
          <SocialLinks className="mt-3 justify-center @lg:justify-start" />
        </div>
      </div>

      <div className="mt-6 space-y-3 leading-relaxed">
        {bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {/* About the site itself, so it's left out of the CV summary (which uses only about.bio). */}
        <p>{t('about.siteNote')}</p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 @xl:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-xl border border-border bg-surface-2/60 p-3">
            <dt className="text-xs text-muted">{fact.label}</dt>
            <dd className="mt-0.5 font-semibold">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => openApp('contact')}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          <FiSend aria-hidden /> {t('about.contactMe')}
        </button>
        <a
          href={cvUrl()}
          download
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent-soft"
        >
          <FiDownload aria-hidden /> {t('cv.download')}
        </a>
      </div>
    </div>
  )
}
