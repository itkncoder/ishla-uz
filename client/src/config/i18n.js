import i18n from 'i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['uz', 'ru', 'en'],
    fallbackLng: 'uz',
    lng: 'uz',
    ns: [
      'common',
      'auth',
      'candidate',
      'employer',
      'recruiter',
      'seniorManager',
      'visaOfficer',
      'admin',
      'agency',
      'documents',
      'workflow',
    ],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
