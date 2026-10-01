import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Avatar from './Avatar'

const BOOT_MS = 1400
const SESSION_KEY = 'booted'

/** Shows once per browser session, unless the visitor prefers reduced motion. */
function shouldBoot(): boolean {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return sessionStorage.getItem(SESSION_KEY) !== '1'
  } catch {
    return false
  }
}

// A short "ArsenOS is starting" splash. Skippable with any click or key.
export default function BootScreen() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(shouldBoot)
  const [step, setStep] = useState(0)
  const steps = t('boot.steps', { returnObjects: true }) as string[]

  useEffect(() => {
    if (!visible) return
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // Private mode: the splash just shows again next time.
    }
    const stepTimer = setInterval(() => setStep((s) => s + 1), BOOT_MS / steps.length)
    const doneTimer = setTimeout(() => setVisible(false), BOOT_MS)
    const skip = () => setVisible(false)
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      clearInterval(stepTimer)
      clearTimeout(doneTimer)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [visible, steps.length])

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          role="status"
          aria-live="polite"
          aria-label={t('boot.label')}
          className="fixed inset-0 z-[20000] grid place-items-center bg-[#0b1020] text-slate-200"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="flex w-64 flex-col items-center gap-5">
            <Avatar className="size-20 animate-pop text-2xl shadow-2xl shadow-indigo-500/30" />

            <p className="animate-rise text-lg font-semibold tracking-wide" style={{ animationDelay: '100ms' }}>
              ArsenOS
            </p>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-pink-400"
                style={{ animation: `boot-progress ${BOOT_MS}ms ease-in-out forwards` }}
              />
            </div>
            <p className="h-4 font-mono text-xs text-slate-400">{steps[Math.min(step, steps.length - 1)]}</p>
          </div>
          <p className="absolute bottom-6 text-xs text-slate-500">{t('boot.skip')}</p>
        </m.div>
      )}
    </AnimatePresence>
  )
}
