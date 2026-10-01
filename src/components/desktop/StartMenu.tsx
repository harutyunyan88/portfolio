import * as m from 'motion/react-m'
import { useEffect, useRef, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { FcFlashOn } from 'react-icons/fc'
import { FiDownload } from 'react-icons/fi'
import { Link } from '../../lib/router'
import { APPS, DESKTOP_ORDER } from '../../apps/registry'
import { cvUrl } from '../../lib/constants'
import { useWindowsStore } from '../../store/windows'
import Avatar from '../Avatar'

type Props = {
  onClose: () => void
  /** The Start button, so clicking it toggles instead of closing and reopening. */
  toggleRef: RefObject<HTMLButtonElement | null>
}

export default function StartMenu({ onClose, toggleRef }: Props) {
  const { t } = useTranslation()
  const open = useWindowsStore((s) => s.open)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node
      if (!ref.current?.contains(target) && !toggleRef.current?.contains(target)) onClose()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, toggleRef])

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full left-2 mb-2 w-[22rem] overflow-hidden rounded-xl border border-border bg-surface shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 border-b border-border p-4">
        <Avatar className="size-12 text-lg" />
        <div>
          <p className="font-semibold">{t('profile.name')}</p>
          <p className="text-sm text-muted">{t('profile.role')}</p>
        </div>
      </div>

      <p className="px-4 pt-3 text-xs font-semibold tracking-wide text-muted uppercase">{t('taskbar.allApps')}</p>
      <ul className="grid grid-cols-3 gap-1 p-2">
        {DESKTOP_ORDER.map((id) => {
          const Icon = APPS[id].icon
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => {
                  open(id)
                  onClose()
                }}
                className="flex w-full flex-col items-center gap-1 rounded-lg p-2 text-xs hover:bg-accent-soft"
              >
                <Icon className="size-8" aria-hidden />
                {t(`apps.${id}`)}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="flex gap-2 border-t border-border bg-surface-2/60 p-3">
        <Link
          to="/quick"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent-soft"
        >
          <FcFlashOn aria-hidden /> {t('common.quickView')}
        </Link>
        <a
          href={cvUrl()}
          download
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <FiDownload aria-hidden /> {t('cv.download')}
        </a>
      </div>
    </m.div>
  )
}
