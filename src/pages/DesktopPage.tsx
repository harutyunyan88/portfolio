import Desktop from '../components/desktop/Desktop'
import MobileHome from '../components/mobile/MobileHome'
import { useMediaQuery } from '../hooks/useMediaQuery'

export default function DesktopPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <MobileHome /> : <Desktop />
}
