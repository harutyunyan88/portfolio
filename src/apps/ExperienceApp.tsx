import { useTranslation } from 'react-i18next'
import { FiMapPin } from 'react-icons/fi'
import { EXPERIENCE } from '../data/experience'
import { formatMonth } from '../lib/format'
import { AppPage, stagger, Tag, TagList } from './ui'

export default function ExperienceApp() {
  const { t, i18n } = useTranslation()
  const locale = i18n.resolvedLanguage

  return (
    <AppPage title={t('apps.experience')}>
      <ol className="relative space-y-8 border-l-2 border-border pl-6">
        {EXPERIENCE.map((job, i) => {
          const bullets = t(`experience.items.${job.id}.bullets`, { returnObjects: true }) as string[]
          const period = `${formatMonth(job.start, locale)} — ${job.end ? formatMonth(job.end, locale) : t('common.present')}`

          return (
            <li key={job.id} style={stagger(i, 150)} className="relative animate-rise">
              <span
                aria-hidden
                className={
                  'absolute top-1.5 -left-[33px] size-4 rounded-full border-4 border-surface-solid ' +
                  (job.end ? 'bg-muted' : 'bg-accent ring-4 ring-accent-soft')
                }
              />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-lg font-semibold">{t(`experience.items.${job.id}.role`)}</h3>
                <Tag>{t(`experience.types.${job.type}`)}</Tag>
              </div>
              <p className="font-medium text-accent">{job.company}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm text-muted">
                <span>{period}</span>
                <span className="inline-flex items-center gap-1">
                  <FiMapPin aria-hidden /> {t(`experience.items.${job.id}.location`)}
                </span>
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-accent">
                {bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="mt-3">
                <TagList items={job.tech} />
              </div>
            </li>
          )
        })}
      </ol>
    </AppPage>
  )
}
