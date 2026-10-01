import { AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FcFlashOn } from 'react-icons/fc'
import { AppHostProvider } from '../../apps/AppHost'
import { DESKTOP_ORDER, type AppId } from '../../apps/registry'
import { Link } from '../../lib/router'
import { useWindowsStore, type WindowState } from '../../store/windows'
import CommandPalette from '../CommandPalette'
import DesktopIcon from './DesktopIcon'
import Taskbar from './Taskbar'
import Window from './Window'

export default function Desktop() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<AppId | null>(null)
  const { windows, open } = useWindowsStore()
  const openWindows = Object.values(windows) as WindowState[]

  // Greet visitors with the About window instead of an empty desktop.
  useEffect(() => {
    if (Object.keys(useWindowsStore.getState().windows).length === 0) open('about')
  }, [open])

  return (
    <AppHostProvider value={{ mode: 'desktop', openApp: open }}>
      <div className="wallpaper flex h-full flex-col overflow-hidden">
        <main className="relative min-h-0 flex-1" onClick={() => setSelected(null)}>
          <ul className="grid h-full grid-flow-col grid-rows-[repeat(auto-fill,6.5rem)] content-start justify-start gap-1 p-3">
            {DESKTOP_ORDER.map((id, i) => (
              <li key={id} className="animate-pop" style={{ animationDelay: `${120 + i * 45}ms` }}>
                <DesktopIcon
                  id={id}
                  selected={selected === id}
                  onSelect={() => setSelected(id)}
                  onOpen={() => {
                    setSelected(null)
                    open(id)
                  }}
                />
              </li>
            ))}
          </ul>

          <Link
            to="/quick"
            onClick={(e) => e.stopPropagation()}
            style={{ animationDelay: '500ms' }}
            className="absolute top-4 right-4 flex animate-rise items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <FcFlashOn className="size-5" aria-hidden />
            <span>
              <span className="font-semibold">{t('common.quickView')}</span>
              <span className="hidden text-muted lg:inline"> · {t('common.quickViewHint')}</span>
            </span>
          </Link>

          {openWindows.length === 0 && (
            <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-surface px-4 py-1.5 text-sm text-muted backdrop-blur">
              {t('desktop.hint')}
            </p>
          )}

          {/* Windows are positioned relative to this layer, so they can't be dragged under the taskbar. */}
          <div className="pointer-events-none absolute inset-0 [&>*]:pointer-events-auto">
            <AnimatePresence>
              {openWindows.map((win) => (
                <Window key={win.id} win={win} />
              ))}
            </AnimatePresence>
          </div>
        </main>

        <Taskbar />
      </div>
      <CommandPalette />
    </AppHostProvider>
  )
}
