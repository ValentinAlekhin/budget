import en from './locales/en'
import ru from './locales/ru'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'ru',
  getLocaleCookie: 'i18n',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    redirectOn: 'root',
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
  messages: {
    ru,
    en,
  },
}))
