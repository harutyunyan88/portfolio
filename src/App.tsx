import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import DesktopPage from './pages/DesktopPage'
import QuickViewPage from './pages/QuickViewPage'
import { useThemeStore } from './store/theme'

export default function App() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <Routes>
      <Route path="/" element={<DesktopPage />} />
      <Route path="/quick" element={<QuickViewPage />} />
      <Route path="*" element={<DesktopPage />} />
    </Routes>
  )
}
