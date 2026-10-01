import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useThemeStore } from '../../store/theme'

export default function ThemeToggle({ className }: { className?: string }) {
  const { t } = useTranslation()
  const { theme, toggle } = useThemeStore()
  const label = theme === 'dark' ? t('taskbar.switchToLight') : t('taskbar.switchToDark')

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={clsx('grid size-8 place-items-center rounded-md hover:bg-accent-soft', className)}
    >
      {theme === 'dark' ? <FiSun aria-hidden /> : <FiMoon aria-hidden />}
    </button>
  )
}
