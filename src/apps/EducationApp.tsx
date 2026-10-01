import { useTranslation } from 'react-i18next'
import { FcGraduationCap } from 'react-icons/fc'
import { COURSES, SPOKEN_LANGUAGES } from '../data/education'
import { formatMonth } from '../lib/format'
import { AppPage, stagger, TagList } from './ui'

export default function EducationApp() {
  const { t, i18n } = useTranslation()
  const locale = i18n.resolvedLanguage

  return (
    <AppPage title={t('apps.education')}>
      <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">{t('education.coursesTitle')}</h3>
      <ul className="space-y-3">
        {COURSES.map((course, i) => (
          <li key={course.id} style={stagger(i, 100)} className="flex animate-rise gap-4 rounded-xl border border-border bg-surface-2/60 p-4">
            <FcGraduationCap className="size-9 shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h4 className="font-semibold">{t(`education.items.${course.id}.title`)}</h4>
                <span className="text-sm text-muted">
                  {formatMonth(course.start, locale)} — {formatMonth(course.end, locale)}
                </span>
              </div>
              <p className="text-sm font-medium text-accent">{course.school}</p>
              <p className="mt-1.5 text-sm text-muted">{t(`education.items.${course.id}.description`)}</p>
              <div className="mt-3">
                <TagList items={course.topics} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="mt-8 mb-3 text-xs font-semibold tracking-wider text-muted uppercase">
        {t('education.languagesTitle')}
      </h3>
      <ul className="grid gap-2 @lg:grid-cols-3">
        {SPOKEN_LANGUAGES.map((lang) => (
          <li key={lang.id} className="rounded-xl border border-border bg-surface-2/60 p-3">
            <p className="font-semibold">{t(`education.spoken.${lang.id}`)}</p>
            <p className="text-xs text-muted">{t(`education.levels.${lang.level}`)}</p>
          </li>
        ))}
      </ul>
    </AppPage>
  )
}
