import clsx from 'clsx'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { APPS, type AppId } from '../../apps/registry'
import { useClock } from '../../hooks/useClock'
import { TASKBAR_HEIGHT, useWindowsStore } from '../../store/windows'
import Avatar from '../Avatar'
import LanguageSwitcher from '../controls/LanguageSwitcher'
import SearchButton from '../controls/SearchButton'
import ThemeToggle from '../controls/ThemeToggle'
import StartMenu from './StartMenu'

export default function Taskbar() {
  const { t, i18n } = useTranslation()
  const [startOpen, setStartOpen] = useState(false)
  const startRef = useRef<HTMLButtonElement>(null)
  const { windows, activeId, focus, minimize } = useWindowsStore()
  const now = useClock()

  const openIds = Object.keys(windows) as AppId[]

  const onTaskClick = (id: AppId) => {
    // Like a real OS: clicking the focused window's button minimizes it.
    if (activeId === id && !windows[id]?.minimized) minimize(id)
    else focus(id)
  }

  return (
    <footer
      style={{ height: TASKBAR_HEIGHT }}
      className="relative z-[9999] flex animate-slide-up items-center gap-1 border-t border-border bg-taskbar px-2 backdrop-blur-xl"
    >
      <button
        ref={startRef}
        type="button"
        onClick={() => setStartOpen((o) => !o)}
        aria-expanded={startOpen}
        aria-label={t('taskbar.start')}
        className={clsx(
          'grid size-10 place-items-center rounded-lg transition-colors hover:bg-accent-soft',
          startOpen && 'bg-accent-soft',
        )}
      >
        <Avatar className="size-7 text-[10px]" ring={2} />
      </button>
      {startOpen && <StartMenu onClose={() => setStartOpen(false)} toggleRef={startRef} />}

      <SearchButton variant="taskbar" className="mr-1" />

      <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
        {openIds.map((id) => {
          const Icon = APPS[id].icon
          const active = activeId === id && !windows[id]?.minimized
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTaskClick(id)}
              className={clsx(
                'relative flex h-10 max-w-44 shrink-0 items-center gap-2 rounded-lg px-3 text-sm transition-colors',
                active ? 'bg-accent-soft' : 'hover:bg-accent-soft/60',
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              <span className="truncate">{t(`apps.${id}`)}</span>
              <span
                className={clsx(
                  'absolute bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-accent transition-all',
                  active ? 'w-5' : 'w-2 opacity-60',
                )}
              />
            </button>
          )
        })}
      </nav>

      <div className="flex items-center gap-1">
        <SearchButton variant="icon" className="lg:hidden" />
        <LanguageSwitcher direction="up" />
        <ThemeToggle />
        <time dateTime={now.toISOString()} className="ml-1 px-2 text-right text-xs leading-tight tabular-nums">
          {now.toLocaleTimeString(i18n.resolvedLanguage, { hour: '2-digit', minute: '2-digit' })}
          <br />
          <span className="text-muted">{now.toLocaleDateString(i18n.resolvedLanguage)}</span>
        </time>
      </div>
    </footer>
  )
}
