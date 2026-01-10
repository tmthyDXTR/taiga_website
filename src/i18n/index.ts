import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import en from './locales/en.json'
import de from './locales/de.json'
import es from './locales/es.json'
import ja from './locales/ja.json'

const resources = {
  en: {
    translation: en
  },
  de: {
    translation: de
  },
  es: {
    translation: es
  },
  ja: {
    translation: ja
  }
}

i18n
  .use(LanguageDetector) // Automatically detect user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback language if detection fails
    debug: false, // Set to true for development debugging

    interpolation: {
      escapeValue: false // React already does escaping
    },

    detection: {
      // Language detection options
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  })

export default i18n