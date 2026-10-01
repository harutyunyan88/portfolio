import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../../i18n'

type Props = {
  className?: string
  /** Which way the menu opens; the taskbar needs it to open upwards. */
  direction?: 'up' | 'down'
}

export default function LanguageSwitcher({ className, direction = 'down' }: Props) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? LANGUAGES[0]

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={clsx('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('taskbar.language')}
        title={t('taskbar.language')}
        className="h-8 rounded-md px-2 text-xs font-semibold hover:bg-accent-soft"
      >
        {current.label}
      </button>
      {open && (
        <ul
          role="listbox"
          className={clsx(
            'absolute right-0 z-50 min-w-36 overflow-hidden rounded-lg border border-border bg-surface-solid py-1 text-sm shadow-xl',
            direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2',
          )}
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.code === current.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code)
                  setOpen(false)
                }}
                className={clsx(
                  'flex w-full items-center justify-between gap-4 px-3 py-1.5 text-left hover:bg-accent-soft',
                  lang.code === current.code && 'font-semibold text-accent',
                )}
              >
                {lang.name}
                <span className="text-xs text-muted">{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
