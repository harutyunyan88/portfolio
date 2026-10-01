import { useTranslation } from 'react-i18next'
import { SKILL_GROUPS } from '../data/skills'
import { AppPage } from './ui'

export default function SkillsApp() {
  const { t } = useTranslation()

  return (
    <AppPage title={t('apps.skills')} intro={t('skills.intro')}>
      <div className="space-y-7">
        {SKILL_GROUPS.map((group) => (
          <section key={group.id}>
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">
              {t(`skills.groups.${group.id}`)}
            </h3>
            <ul className="grid grid-cols-2 gap-2 @md:grid-cols-3 @2xl:grid-cols-4">
              {group.skills.map(({ name, icon: Icon, color }) => (
                <li
                  key={name}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-surface-2/60 p-3 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                >
                  <Icon
                    className="size-7 shrink-0 transition-transform group-hover:scale-110"
                    style={color ? { color } : undefined}
                    aria-hidden
                  />
                  <span className="text-sm leading-tight font-medium">{name}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </AppPage>
  )
}
