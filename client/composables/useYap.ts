import { createSharedComposable } from '@vueuse/core'
import { evaluateStringTemplate } from 'string-template-parser'
import * as yup from 'yup'
import * as yapLocales from 'yup-locales'

export const useYap = createSharedComposable(() => {
  const { locale, t } = useI18n()
  let mounted = false
  const setYupLocale = (value: string) => {
    const locales: Record<string, any> = {
      ru: yapLocales.ru,
      en: yup.defaultLocale,
    }
    const newLocale = locales[value]
    if (!newLocale)
      return
    yup.setLocale(newLocale)
  }

  const init = (force = false) => {
    if (!force && mounted)
      return

    setYupLocale(locale.value)

    yup.ValidationError.formatError = (message, params) => {
      params.label = t(`common.${params.path}`) || params.path

      if (typeof message === 'string') {
        message = message.replaceAll('${path}', '${label}')
        // @ts-ignore
        return evaluateStringTemplate(message, params)
      }

      if (typeof message === 'function')
        return message(params)

      return message
    }

    mounted = true
  }
  init()

  watch(locale, (value) => {
    setYupLocale(value)
    init(true)
  })

  return yup
})
