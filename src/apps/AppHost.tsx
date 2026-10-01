import { createContext, useContext, type ReactNode } from 'react'
import type { AppId } from './registry'

// Lets app content open another app without knowing whether it runs
// in a desktop window, on the mobile home screen or in the quick view.
type AppHost = {
  mode: 'desktop' | 'mobile' | 'quick'
  openApp: (id: AppId) => void
}

const AppHostContext = createContext<AppHost>({ mode: 'desktop', openApp: () => {} })

export function AppHostProvider({ value, children }: { value: AppHost; children: ReactNode }) {
  return <AppHostContext.Provider value={value}>{children}</AppHostContext.Provider>
}

export const useAppHost = () => useContext(AppHostContext)
