import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FcFlashOn } from 'react-icons/fc'
import { FiChevronLeft } from 'react-icons/fi'
import { Link } from '../../lib/router'
import AppContent from '../../apps/AppContent'
import { AppHostProvider } from '../../apps/AppHost'
import { APPS, DESKTOP_ORDER, type AppId } from '../../apps/registry'
import { useClock } from '../../hooks/useClock'
import Avatar from '../Avatar'
import CommandPalette from '../CommandPalette'
import LanguageSwitcher from '../controls/LanguageSwitcher'
import SearchButton from '../controls/SearchButton'
import ThemeToggle from '../controls/ThemeToggle'

// Phone version of the desktop: an app grid, and apps open full screen.
export default function MobileHome() {
  const { t, i18n } = useTranslation()
  const [openApp, setOpenApp] = useState<AppId | null>(null)
  const now = useClock()

  return (
    <AppHostProvider value={{ mode: 'mobile', openApp: setOpenApp }}>
      <div className="wallpaper flex h-full flex-col overflow-y-auto">
        <header className="flex h-11 shrink-0 items-center justify-between px-4 text-sm">
          <time className="font-semibold tabular-nums">
            {now.toLocaleTimeString(i18n.resolvedLanguage, { hour: '2-digit', minute: '2-digit' })}
          </time>
          <div className="flex items-center">
            <SearchButton variant="icon" />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <div className="flex animate-rise flex-col items-center gap-2 px-6 pt-6 pb-8 text-center">
          <Avatar className="size-20 text-2xl shadow-xl" />
          <h1 className="text-xl font-semibold">{t('profile.name')}</h1>
          <p className="text-sm text-muted">{t('profile.role')}</p>
        </div>

        <ul className="grid grid-cols-4 gap-x-2 gap-y-5 px-4">
          {DESKTOP_ORDER.map((id, i) => {
            const Icon = APPS[id].icon
            return (
              <li key={id} className="animate-pop" style={{ animationDelay: `${150 + i * 40}ms` }}>
                <button
                  type="button"
                  onClick={() => setOpenApp(id)}
                  className="flex w-full flex-col items-center gap-1.5 text-center"
                >
                  <span className="grid size-14 place-items-center rounded-2xl border border-border bg-surface shadow-md backdrop-blur">
                    <Icon className="size-8" aria-hidden />
                  </span>
                  <span className="line-clamp-1 text-[11px] font-medium">{t(`apps.${id}`)}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-auto p-4">
          <Link
            to="/quick"
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-xl"
          >
            <FcFlashOn className="size-5" aria-hidden /> {t('common.quickView')}
          </Link>
        </div>

        <AnimatePresence>
          {openApp && <MobileAppView key={openApp} id={openApp} onBack={() => setOpenApp(null)} />}
        </AnimatePresence>
      </div>
      <CommandPalette />
    </AppHostProvider>
  )
}

function MobileAppView({ id, onBack }: { id: AppId; onBack: () => void }) {
  const { t } = useTranslation()

  return (
    <m.section
      role="dialog"
      aria-label={t(`apps.${id}`)}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 flex flex-col bg-surface-solid"
    >
      <header className="flex h-12 shrink-0 items-center gap-1 border-b border-border px-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-accent"
        >
          <FiChevronLeft aria-hidden /> {t('common.back')}
        </button>
        <h2 className="flex-1 pr-16 text-center text-sm font-semibold">{t(`apps.${id}`)}</h2>
      </header>
      <div className="min-h-0 flex-1 overflow-auto">
        <AppContent id={id} />
      </div>
    </m.section>
  )
}
