import clsx from 'clsx'
import * as m from 'motion/react-m'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FiMaximize2, FiMinimize2, FiMinus, FiX } from 'react-icons/fi'
import { Rnd } from 'react-rnd'
import AppContent from '../../apps/AppContent'
import { APPS } from '../../apps/registry'
import { useWindowsStore, type WindowState } from '../../store/windows'

export default function Window({ win }: { win: WindowState }) {
  const { t } = useTranslation()
  const { focus, close, minimize, toggleMaximize, move, resize } = useWindowsStore()
  const isActive = useWindowsStore((s) => s.activeId === win.id)
  const app = APPS[win.id]
  const Icon = app.icon

  return (
    <Rnd
      size={win.maximized ? { width: '100%', height: '100%' } : { width: win.width, height: win.height }}
      position={win.maximized ? { x: 0, y: 0 } : { x: win.x, y: win.y }}
      bounds="parent"
      minWidth={320}
      minHeight={220}
      dragHandleClassName="window-drag-handle"
      cancel=".window-controls"
      disableDragging={win.maximized}
      enableResizing={!win.maximized}
      onDragStart={() => focus(win.id)}
      onDragStop={(_, d) => move(win.id, d.x, d.y)}
      onResizeStop={(_, __, ref, ___, pos) =>
        resize(win.id, { width: ref.offsetWidth, height: ref.offsetHeight, x: pos.x, y: pos.y })
      }
      style={{ zIndex: win.z, pointerEvents: win.minimized ? 'none' : undefined }}
    >
      {/* Minimized windows stay mounted (keeping their state) but shrink toward the taskbar and become inert. */}
      <m.section
        role="dialog"
        aria-label={t(`apps.${win.id}`)}
        inert={win.minimized}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={win.minimized ? { opacity: 0, scale: 0.6, y: 240 } : { opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.14 } }}
        transition={{ duration: win.minimized ? 0.22 : 0.18, ease: 'easeOut' }}
        onPointerDownCapture={() => focus(win.id)}
        className={clsx(
          'flex h-full flex-col overflow-hidden border border-border bg-surface backdrop-blur-xl',
          win.maximized ? 'rounded-none' : 'rounded-xl',
          isActive ? 'shadow-2xl shadow-black/25' : 'shadow-lg shadow-black/10',
        )}
      >
        <header
          className="window-drag-handle flex h-10 shrink-0 cursor-default items-center gap-2 border-b border-border bg-surface-2/60 pl-3 select-none"
          onDoubleClick={() => toggleMaximize(win.id)}
        >
          <Icon className="size-4" aria-hidden />
          <h2 className={clsx('flex-1 truncate text-sm font-medium', !isActive && 'text-muted')}>
            {t(`apps.${win.id}`)}
          </h2>
          <div className="window-controls flex h-full">
            <WindowButton label={t('window.minimize')} onClick={() => minimize(win.id)}>
              <FiMinus />
            </WindowButton>
            <WindowButton
              label={win.maximized ? t('window.restore') : t('window.maximize')}
              onClick={() => toggleMaximize(win.id)}
            >
              {win.maximized ? <FiMinimize2 /> : <FiMaximize2 />}
            </WindowButton>
            <WindowButton label={t('window.close')} onClick={() => close(win.id)} danger>
              <FiX />
            </WindowButton>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-auto">
          <AppContent id={win.id} />
        </div>
      </m.section>
    </Rnd>
  )
}

type WindowButtonProps = {
  label: string
  onClick: () => void
  danger?: boolean
  children: ReactNode
}

function WindowButton({ label, onClick, danger, children }: WindowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={clsx(
        'grid w-11 place-items-center text-sm text-muted transition-colors',
        danger ? 'hover:bg-red-500 hover:text-white' : 'hover:bg-accent-soft hover:text-text',
      )}
    >
      {children}
    </button>
  )
}
