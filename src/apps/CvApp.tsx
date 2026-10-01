import { useTranslation } from 'react-i18next'
import { FiDownload, FiExternalLink } from 'react-icons/fi'
import { CV_URL } from '../lib/constants'

export default function CvApp() {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-end gap-2 border-b border-border px-3 py-2">
        <a
          href={CV_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted hover:bg-accent-soft hover:text-text"
        >
          <FiExternalLink aria-hidden /> {t('cv.open')}
        </a>
        <a
          href={CV_URL}
          download
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
        >
          <FiDownload aria-hidden /> {t('cv.download')}
        </a>
      </div>
      <iframe src={CV_URL} title={t('apps.cv')} className="min-h-0 flex-1 bg-white" />
    </div>
  )
}
