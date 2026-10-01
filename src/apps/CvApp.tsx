import { useTranslation } from 'react-i18next'
import { FcDocument } from 'react-icons/fc'
import { FiDownload, FiExternalLink } from 'react-icons/fi'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { cvUrl } from '../lib/constants'

export default function CvApp() {
  const { t, i18n } = useTranslation()
  // Phones can't show a PDF inside a page (Android shows nothing, iOS only page 1), so offer buttons instead.
  const isTouch = useMediaQuery('(pointer: coarse)')
  const lang = i18n.resolvedLanguage

  const openLink = (
    <a
      href={cvUrl({ lang, inline: true })}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent-soft"
    >
      <FiExternalLink aria-hidden /> {t('cv.open')}
    </a>
  )
  const downloadLink = (
    <a
      href={cvUrl({ lang })}
      download
      className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
    >
      <FiDownload aria-hidden /> {t('cv.download')}
    </a>
  )

  if (isTouch) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <FcDocument className="size-16" aria-hidden />
        <p className="font-semibold">{t('profile.name')} — CV</p>
        <div className="flex flex-wrap justify-center gap-2">
          {openLink}
          {downloadLink}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-end gap-2 border-b border-border px-3 py-2">
        {openLink}
        {downloadLink}
      </div>
      {/* Keyed by language so switching language reloads the PDF. */}
      <iframe key={lang} src={cvUrl({ lang, inline: true })} title={t('apps.cv')} className="min-h-0 flex-1 bg-white" />
    </div>
  )
}
