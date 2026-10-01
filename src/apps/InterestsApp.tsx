import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { INTERESTS } from '../data/interests'
import { AppPage, stagger } from './ui'

export default function InterestsApp() {
  const { t } = useTranslation()

  return (
    <AppPage title={t('apps.interests')} intro={t('interests.intro')}>
      <ul className="grid grid-cols-1 gap-3 @md:grid-cols-2 @3xl:grid-cols-3">
        {INTERESTS.map(({ id, icon: Icon, tint }, i) => (
          <li
            key={id}
            style={stagger(i, 60)}
            className="group flex animate-rise items-start gap-3 rounded-xl border border-border bg-surface-2/60 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className={clsx('grid size-11 shrink-0 place-items-center rounded-xl transition-transform group-hover:rotate-6', tint)}>
              <Icon className="size-6" aria-hidden />
            </span>
            <div>
              <h3 className="font-semibold">{t(`interests.items.${id}.title`)}</h3>
              <p className="mt-0.5 text-sm text-muted">{t(`interests.items.${id}.description`)}</p>
            </div>
          </li>
        ))}
      </ul>
    </AppPage>
  )
}
