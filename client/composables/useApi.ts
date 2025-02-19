import { useLocalStorage } from '@vueuse/core'
import axios, { type AxiosResponse } from 'axios'

const api = axios.create()

export function useApi() {
  const {
    public: { domain, httpProtocol },
  } = useRuntimeConfig()

  const baseUrl = `${httpProtocol}://${domain}`
  api.defaults.baseURL = !process.client ? baseUrl : '/api'

  const tokensStore = useLocalStorage(
    'tokens',
    { accessToken: '', refreshToken: '' },
    { mergeDefaults: true },
  )
  const cookieToken = useCookie('token')

  const resetTokens = () =>
    (tokensStore.value = { accessToken: '', refreshToken: '' })

  api.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (err) => {
      const originalConfig = err.config
      const isAuthErr = err.response.status === 401

      if (!isAuthErr || originalConfig._retry) return Promise.reject(err)

      originalConfig._retry = true

      const router = useRouter()

      try {
        const payload: RefreshTokenRequestDto = {
            refreshToken: tokensStore.value.refreshToken,
        }
        const { data } = await api.post<RefreshTokenResponseDto>('/auth/refresh-tokens', payload)

        tokensStore.value = {
          refreshToken: data.refreshToken,
          accessToken: data.accessToken,
        }

        const authHeader = `Bearer ${data.accessToken}`
        api.defaults.headers.common.Authorization = authHeader
        originalConfig.headers.Authorization = authHeader
        cookieToken.value = data.accessToken

        return api(originalConfig)
      } catch (e) {
        resetTokens()
        await router.push('/auth')
        return Promise.reject(e)
      }
    },
  )

  return { api, baseUrl, tokensStore, resetTokens }
}
