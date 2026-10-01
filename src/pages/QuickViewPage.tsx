import { useTranslation } from 'react-i18next'
import { FiArrowLeft, FiDownload } from 'react-icons/fi'
import { Link } from '../lib/router'
import AppContent from '../apps/AppContent'
import { AppHostProvider } from '../apps/AppHost'
import { DESKTOP_ORDER, type AppId } from '../apps/registry'
import CommandPalette from '../components/CommandPalette'
import LanguageSwitcher from '../components/controls/LanguageSwitcher'
import SearchButton from '../components/controls/SearchButton'
import ThemeToggle from '../components/controls/ThemeToggle'
import Reveal from '../components/Reveal'
import { cvUrl } from '../lib/constants'

// The CV and terminal are desktop "programs"; the quick view links to the CV instead.
const SECTIONS: AppId[] = DESKTOP_ORDER.filter((id) => id !== 'cv' && id !== 'terminal')

const scrollToSection = (id: AppId) => {
  if (id === 'cv') window.open(cvUrl({ inline: true }), '_blank')
  else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// Classic one-page layout for recruiters. It reuses the same app components as the desktop windows.
export default function QuickViewPage() {
  const { t } = useTranslation()

  return (
    <AppHostProvider value={{ mode: 'quick', openApp: scrollToSection }}>
      <div className="min-h-full bg-bg">
        <header className="sticky top-0 z-10 border-b border-border bg-surface backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
            <Link to="/" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted hover:text-text">
              <FiArrowLeft aria-hidden /> <span className="hidden sm:inline">{t('common.backToDesktop')}</span>
            </Link>
            <nav className="mx-auto hidden gap-1 md:flex">
              {SECTIONS.map((id) => (
                <a key={id} href={`#${id}`} className="rounded-md px-2.5 py-1.5 text-sm text-muted hover:bg-accent-soft hover:text-text">
                  {t(`apps.${id}`)}
                </a>
              ))}
            </nav>
            <div className="ml-auto flex items-center md:ml-0">
              <SearchButton variant="icon" />
              <LanguageSwitcher />
              <ThemeToggle />
              <a
                href={cvUrl()}
                download
                aria-label={t('cv.download')}
                title={t('cv.download')}
                className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
              >
                <FiDownload aria-hidden /> <span className="hidden lg:inline">{t('cv.download')}</span>
              </a>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="sr-only">
            {t('profile.name')} — {t('profile.role')}
          </h1>
          <div className="space-y-6">
            {SECTIONS.map((id) => (
              <Reveal key={id}>
                <section id={id} className="scroll-mt-20 overflow-hidden rounded-2xl border border-border bg-surface-solid">
                  <AppContent id={id} />
                </section>
              </Reveal>
            ))}
          </div>
        </main>
      </div>
      <CommandPalette />
    </AppHostProvider>
  )
}
