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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <Suspense fallback={<div className="wallpaper h-full" />}>
          {pathname === '/quick' ? <QuickViewPage /> : <DesktopPage />}
        </Suspense>
      </LazyMotion>
    </MotionConfig>
  )
}
