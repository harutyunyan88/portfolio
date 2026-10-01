import { useSyncExternalStore, type AnchorHTMLAttributes } from 'react'

// The site has two pages (`/` and `/quick`), so a full router library isn't worth its ~37 KB.

const subscribe = (onChange: () => void) => {
  window.addEventListener('popstate', onChange)
  return () => window.removeEventListener('popstate', onChange)
}

export const usePathname = () => useSyncExternalStore(subscribe, () => window.location.pathname)

export function navigate(to: string) {
  if (to === window.location.pathname) return
  window.history.pushState(null, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

/** An <a> that navigates without a page reload; Ctrl/Cmd-click still opens a new tab. */
export function Link({ to, onClick, ...props }: LinkProps) {
  return (
    <a
      {...props}
      href={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        navigate(to)
      }}
    />
  )
}
