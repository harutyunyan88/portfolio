import { Analytics } from '@vercel/analytics/react'
import { LazyMotion, MotionConfig } from 'motion/react'
import { lazy, Suspense, useEffect } from 'react'
import { usePathname } from './lib/router'
import { useThemeStore } from './store/theme'

// Each page is its own chunk, so the quick view doesn't download the desktop shell and vice versa.
const DesktopPage = lazy(() => import('./pages/DesktopPage'))
const QuickViewPage = lazy(() => import('./pages/QuickViewPage'))

const loadMotionFeatures = () => import('./lib/motionFeatures').then((m) => m.default)

export default function App() {
  const theme = useThemeStore((s) => s.theme)
  const pathname = usePathname()
  const isQuickView = pathname === '/quick'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <Suspense fallback={<div className="wallpaper h-full" />}>
          {isQuickView ? <QuickViewPage /> : <DesktopPage />}
        </Suspense>
      </LazyMotion>
      {/* Vercel Web Analytics: cookie-free page views. Pages are reported explicitly since we use our own router. */}
      <Analytics route={isQuickView ? '/quick' : '/'} path={pathname} />
    </MotionConfig>
  )
}
