import { useEffect, useRef, useState, type HTMLAttributes } from 'react'

/** Fades its content in when scrolled into view (once). Uses CSS, so it doesn't wait for the animation library. */
export default function Reveal({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    // Content already on screen at load shouldn't blink.
    if (el.getBoundingClientRect().top < window.innerHeight) return
    setHidden(true)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHidden(false)
          observer.disconnect()
        }
      },
      // The huge top margin counts everything above the viewport as "seen", so sections skipped by
      // jumping to an anchor (or scrolling fast) are revealed too, instead of staying invisible.
      { rootMargin: '100000px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} data-hidden={hidden} className={`reveal ${className ?? ''}`} {...props} />
}
