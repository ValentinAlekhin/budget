import { string } from 'yup'

export function useBackendValidators() {
  const { api } = useApi()
  const { t } = useI18n()

  const isAvailableUsername = async (username: string) => {
    const { data } = await api.post('/user-field-validation/username', {
      username,
    })

    return data.valid
  }

  const isAvailableEmail = async (email: string) => {
    const { data } = await api.post('/user-field-validation/email', {
      email,
    })

    return data.valid
  }

  const usernameSchema = string()
    .required(t('validation.required'))
    .test('isAvailableUsername', t('validation.taken'), isAvailableUsername)

  const emailSchema = string()
    .required(t('validation.required'))
    .email()
    .test('isAvailableEmail', t('validation.taken'), isAvailableEmail)

  return { isAvailableUsername, usernameSchema, isAvailableEmail, emailSchema }
}
