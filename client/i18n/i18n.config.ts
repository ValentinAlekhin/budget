import en from './locales/en'
import ru from './locales/ru'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  defaultLocale: 'en',
  setLocaleCookie: true,
  getLocaleCookie: 'i18n',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n',
    alwaysRedirect: true,
  },
  locales: [
    {
      code: 'en',
      name: 'English',
    },
    {
      code: 'ru',
      name: 'Русский',
    },
  ],
  vueI18n: {
    fallbackLocale: 'en',
  },
  messages: {
    ru,
    en,
  },
}))
