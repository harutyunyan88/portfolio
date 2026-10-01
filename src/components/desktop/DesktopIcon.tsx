import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { APPS, type AppId } from '../../apps/registry'
import { useMediaQuery } from '../../hooks/useMediaQuery'

type Props = {
  id: AppId
  selected: boolean
  onSelect: () => void
  onOpen: () => void
}

export default function DesktopIcon({ id, selected, onSelect, onOpen }: Props) {
  const { t } = useTranslation()
  // Touch screens have no double-click, so a single tap opens the app there.
  const isTouch = useMediaQuery('(pointer: coarse)')
  const Icon = APPS[id].icon

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        if (isTouch) onOpen()
        else onSelect()
      }}
      onDoubleClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className={clsx(
        'flex w-24 flex-col items-center gap-1.5 rounded-lg p-2 text-center outline-none select-none',
        'focus-visible:ring-2 focus-visible:ring-accent',
        selected ? 'bg-accent-soft ring-1 ring-accent/40' : 'hover:bg-white/30 dark:hover:bg-white/10',
      )}
    >
      <Icon className="size-12 drop-shadow-md" aria-hidden />
      <span className="line-clamp-2 text-xs font-medium [text-shadow:0_1px_2px_rgb(0_0_0/0.25)]">
        {t(`apps.${id}`)}
      </span>
    </button>
  )
}
