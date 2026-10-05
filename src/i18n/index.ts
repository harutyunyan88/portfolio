import i18n, { type BackendModule } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'

export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'hy', label: 'HY', name: 'Հայերեն' },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]['code']

// English is bundled (it's the default and the fallback); the others load only when chosen.
const lazyLocales: BackendModule = {
  type: 'backend',
  init: () => {},
  read: (language, _namespace, callback) => {
    const load = { ru: () => import('./locales/ru.json'), hy: () => import('./locales/hy.json') }[language]
    if (!load) return callback(null, {})
    load().then(
      (module) => callback(null, module.default),
      (error: Error) => callback(error, null),
    )
  },
}

// Missing keys in ru/hy fall back to English, so translations can be filled in gradually.
i18n
  .use(lazyLocales)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en } },
    partialBundledLanguages: true,
    supportedLngs: LANGUAGES.map((l) => l.code),
    fallbackLng: 'en',
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    // No browser-language detection: first visit is English, a chosen language is remembered.
    detection: { order: ['localStorage'], lookupLocalStorage: 'lang', caches: ['localStorage'] },
  })

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})
document.documentElement.lang = i18n.resolvedLanguage ?? 'en'

export default i18n
