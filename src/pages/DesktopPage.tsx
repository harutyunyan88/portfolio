import { lazy, Suspense } from 'react'
import BootScreen from '../components/BootScreen'
import { useMediaQuery } from '../hooks/useMediaQuery'

// Loaded separately so phones never download the window manager (react-rnd) and vice versa.
const Desktop = lazy(() => import('../components/desktop/Desktop'))
const MobileHome = lazy(() => import('../components/mobile/MobileHome'))

export default function DesktopPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return (
    <>
      {/* Own boundary, so the boot screen shows while the desktop code is still loading. */}
      <Suspense fallback={<div className="wallpaper h-full" />}>{isMobile ? <MobileHome /> : <Desktop />}</Suspense>
      <BootScreen />
    </>
  )
}
