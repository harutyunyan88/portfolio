import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { FiExternalLink, FiLock } from 'react-icons/fi'
import { SiGithub } from 'react-icons/si'
import { PROJECTS } from '../data/projects'
import { AppPage, stagger, Tag, TagList } from './ui'

export default function ProjectsApp() {
  const { t } = useTranslation()

  return (
    <AppPage title={t('apps.projects')} intro={t('projects.intro')}>
      <ul className="grid gap-5 @2xl:grid-cols-2">
        {PROJECTS.map((project, i) => {
          const Icon = project.icon
          const highlights = t(`projects.items.${project.id}.highlights`, { returnObjects: true }) as string[]

          return (
            <li
              key={project.id}
              style={stagger(i, 120)}
              className="flex animate-rise flex-col overflow-hidden rounded-2xl border border-border bg-surface-2/60"
            >
              <div className={clsx('relative grid h-32 place-items-center bg-gradient-to-br', project.gradient)}>
                <Icon className="size-12 text-white/90 drop-shadow" aria-hidden />
                <Tag className="absolute top-3 left-3 bg-black/25 text-white backdrop-blur">
                  {t(`projects.kinds.${project.kind}`)} · {t(`projects.roles.${project.role}`)}
                </Tag>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="text-lg leading-snug font-semibold">{t(`projects.items.${project.id}.title`)}</h3>
                <p className="text-sm leading-relaxed text-muted">{t(`projects.items.${project.id}.description`)}</p>
                <ul className="list-disc space-y-1 pl-5 text-sm marker:text-accent">
                  {highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <TagList items={project.tech} />
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent-soft"
                    >
                      <SiGithub aria-hidden /> {t('projects.code')}
                    </a>
                  )}
                  {project.links?.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm text-white hover:opacity-90"
                    >
                      <FiExternalLink aria-hidden /> {t('projects.live')}
                    </a>
                  )}
                  {project.kind === 'client' && (
                    <p className="inline-flex items-center gap-1.5 text-xs text-muted">
                      <FiLock aria-hidden /> {t('projects.private')}
                    </p>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </AppPage>
  )
}
