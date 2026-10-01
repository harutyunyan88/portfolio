import clsx from 'clsx'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FcFlashOn } from 'react-icons/fc'
import { FiCheck, FiCopy, FiDownload, FiGlobe, FiHome, FiMoon, FiSearch, FiSun } from 'react-icons/fi'
import { useAppHost } from '../apps/AppHost'
import { APPS, DESKTOP_ORDER } from '../apps/registry'
import { CONTACTS } from '../data/profile'
import { LANGUAGES } from '../i18n'
import { CV_URL } from '../lib/constants'
import { navigate } from '../lib/router'
import { usePaletteStore } from '../store/palette'
import { useThemeStore } from '../store/theme'

type Command = {
  id: string
  group: 'apps' | 'actions' | 'links'
  label: string
  /** Extra search terms, in English so search works whatever the UI language. */
  keywords?: string
  icon: ReactNode
  /** Return 'stay' to keep the palette open briefly (e.g. to show "Copied"). */
  run: () => void | 'stay'
}

const EMAIL = CONTACTS.find((c) => c.id === 'email')!

/** Ctrl/⌘+K command menu. Rendered inside each page's AppHostProvider so "open app" works everywhere. */
export default function CommandPalette() {
  const { open, setOpen } = usePaletteStore()

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!usePaletteStore.getState().open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  return <AnimatePresence>{open && <Palette onClose={() => setOpen(false)} />}</AnimatePresence>
}

function Palette({ onClose }: { onClose: () => void }) {
  const { t, i18n } = useTranslation()
  const { mode, openApp } = useAppHost()
  const { theme, toggle: toggleTheme } = useThemeStore()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)

  // Give focus back to whatever had it before the palette opened.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    return () => previous?.focus?.()
  }, [])

  const commands = useMemo<Command[]>(() => {
    const apps: Command[] = DESKTOP_ORDER.filter((id) => mode !== 'quick' || id !== 'terminal').map((id) => {
      const Icon = APPS[id].icon
      return {
        id: `app-${id}`,
        group: 'apps',
        label: t(`apps.${id}`),
        keywords: id,
        icon: <Icon />,
        run: () => openApp(id),
      }
    })

    const actions: Command[] = [
      mode === 'quick'
        ? { id: 'desktop', group: 'actions', label: t('common.backToDesktop'), keywords: 'desktop home', icon: <FiHome />, run: () => navigate('/') }
        : { id: 'quick', group: 'actions', label: t('common.quickView'), keywords: 'quick view recruiter one page', icon: <FcFlashOn />, run: () => navigate('/quick') },
      {
        id: 'cv',
        group: 'actions',
        label: t('cv.download'),
        keywords: 'cv resume download pdf',
        icon: <FiDownload />,
        run: () => {
          const a = document.createElement('a')
          a.href = CV_URL
          a.download = ''
          a.click()
        },
      },
      {
        id: 'theme',
        group: 'actions',
        label: theme === 'dark' ? t('taskbar.switchToLight') : t('taskbar.switchToDark'),
        keywords: 'theme dark light mode',
        icon: theme === 'dark' ? <FiSun /> : <FiMoon />,
        run: toggleTheme,
      },
      ...LANGUAGES.filter((l) => l.code !== i18n.resolvedLanguage).map<Command>((l) => ({
        id: `lang-${l.code}`,
        group: 'actions',
        label: `${t('taskbar.language')}: ${l.name}`,
        keywords: `language ${l.code}`,
        icon: <FiGlobe />,
        run: () => void i18n.changeLanguage(l.code),
      })),
      {
        id: 'copy-email',
        group: 'actions',
        label: copied ? t('palette.copied') : t('palette.copyEmail'),
        keywords: 'copy email mail address',
        icon: copied ? <FiCheck className="text-emerald-500" /> : <FiCopy />,
        run: () => {
          if (!navigator.clipboard) return
          void navigator.clipboard.writeText(EMAIL.value).then(() => {
            setCopied(true)
            setTimeout(onClose, 700)
          })
          return 'stay'
        },
      },
    ]

    const links: Command[] = CONTACTS.map(({ id, icon: Icon, value, href }) => ({
      id: `link-${id}`,
      group: 'links',
      label: `${t(`contact.labels.${id}`)} · ${value}`,
      keywords: id,
      icon: <Icon />,
      run: () => {
        if (href.startsWith('http')) window.open(href, '_blank', 'noopener')
        else window.location.href = href
      },
    }))

    return [...apps, ...actions, ...links]
  }, [t, i18n, mode, openApp, theme, toggleTheme, copied, onClose])

  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const results = commands.filter((c) => {
    const haystack = `${c.label} ${c.keywords ?? ''}`.toLowerCase()
    return words.every((w) => haystack.includes(w))
  })
  const activeIndex = Math.min(active, Math.max(results.length - 1, 0))

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, query])

  const run = (command: Command | undefined) => {
    if (!command) return
    if (command.run() !== 'stay') onClose()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((activeIndex + 1) % Math.max(results.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((activeIndex - 1 + results.length) % Math.max(results.length, 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(results[activeIndex])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  let lastGroup: Command['group'] | null = null

  return (
    <m.div
      className="fixed inset-0 z-[10000] flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <m.div
        role="dialog"
        aria-modal="true"
        aria-label={t('palette.title')}
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface-solid shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <FiSearch className="shrink-0 text-muted" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            placeholder={t('palette.placeholder')}
            aria-label={t('palette.placeholder')}
            aria-controls="palette-list"
            aria-activedescendant={results[activeIndex] ? `palette-${results[activeIndex].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            autoComplete="off"
            spellCheck={false}
            className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[11px] text-muted sm:block">Esc</kbd>
        </div>

        <ul ref={listRef} id="palette-list" role="listbox" className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">{t('palette.noResults')}</li>}
          {results.map((command, i) => {
            const heading = command.group !== lastGroup ? command.group : null
            lastGroup = command.group
            return (
              <li key={command.id} role="presentation">
                {heading && (
                  <p className="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
                    {t(`palette.groups.${heading}`)}
                  </p>
                )}
                <button
                  id={`palette-${command.id}`}
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  data-active={i === activeIndex}
                  tabIndex={-1}
                  onMouseMove={() => i !== activeIndex && setActive(i)}
                  onClick={() => run(command)}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm',
                    i === activeIndex ? 'bg-accent-soft text-text' : 'text-text/90',
                  )}
                >
                  <span className="grid size-5 shrink-0 place-items-center text-base text-muted [&>svg]:size-5">
                    {command.icon}
                  </span>
                  <span className="truncate">{command.label}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="hidden items-center gap-4 border-t border-border bg-surface-2/60 px-4 py-2 text-[11px] text-muted pointer-fine:flex">
          <span>
            <kbd className="font-sans">↑↓</kbd> {t('palette.hints.navigate')}
          </span>
          <span>
            <kbd className="font-sans">Enter</kbd> {t('palette.hints.select')}
          </span>
          <span>
            <kbd className="font-sans">Esc</kbd> {t('palette.hints.close')}
          </span>
        </div>
      </m.div>
    </m.div>
  )
}
