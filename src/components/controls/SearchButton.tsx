import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { FiSearch } from 'react-icons/fi'
import { isMac, usePaletteStore } from '../../store/palette'

type Props = {
  /** `taskbar` shows a search field with the shortcut; `icon` is a compact icon button. */
  variant: 'taskbar' | 'icon'
  className?: string
}

export default function SearchButton({ variant, className }: Props) {
  const { t } = useTranslation()
  const setOpen = usePaletteStore((s) => s.setOpen)
  const shortcut = isMac() ? '⌘K' : 'Ctrl K'

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('palette.open')}
        title={t('palette.open')}
        className={clsx('grid size-8 place-items-center rounded-md hover:bg-accent-soft', className)}
      >
        <FiSearch aria-hidden />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={t('palette.open')}
      className={clsx(
        'hidden h-9 w-64 items-center gap-2 rounded-lg border border-border bg-surface-2/60 px-3 text-sm text-muted transition-colors hover:border-accent/40 hover:text-text lg:flex',
        className,
      )}
    >
      <FiSearch className="shrink-0" aria-hidden />
      <span className="flex-1 truncate text-left">{t('palette.searchHint')}</span>
      <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 font-sans text-[11px]">{shortcut}</kbd>
    </button>
  )
}
