import type { AxiosResponse } from 'axios'
import { useLocalStorage } from '@vueuse/core'
import axios from 'axios'
import dayjs from 'dayjs'

const REFRESH_TOKEN_URL = '/auth/refresh-tokens'

const api = axios.create()

export function useApi() {
  const {
    public: { domain, httpProtocol },
  } = useRuntimeConfig()

  const baseUrl = `${httpProtocol}://${domain}`
  // eslint-disable-next-line node/prefer-global/process
  api.defaults.baseURL = !process.client ? baseUrl : '/api'

  const requestCount = ref(0)
  const tokensStore = useLocalStorage(
    'tokens',
    { accessToken: '', refreshToken: '' },
    { mergeDefaults: true },
  )
  const cookieToken = useCookie('token')
  const lastRefresh = ref(dayjs())

  watch(tokensStore, value => cookieToken.value = value.accessToken)

  const resetTokens = () =>
    (tokensStore.value = { accessToken: '', refreshToken: '' })

  const refreshToken = async (): Promise<string> => {
    const payload: RefreshTokenRequestDto = {
      refreshToken: tokensStore.value.refreshToken,
    }
    const { data } = await api.post<RefreshTokenResponseDto>(
      REFRESH_TOKEN_URL,
      payload,
    )

    tokensStore.value = {
      refreshToken: data.refreshToken,
      accessToken: data.accessToken,
    }

    const authHeader = `Bearer ${data.accessToken}`
    api.defaults.headers.common.Authorization = authHeader

    lastRefresh.value = dayjs()

    return authHeader
  }

  const refreshTokenWithTimeLimit = async () => {
    if (dayjs().diff(lastRefresh.value, 'minutes') > 1) {
      return refreshToken()
    }
  }

  api.interceptors.request.use((config) => {
    if (config.url !== REFRESH_TOKEN_URL) {
      requestCount.value++
    }

    return config
  }, (error) => {
    if (error.config.url !== REFRESH_TOKEN_URL) {
      requestCount.value++
    }
    return Promise.reject(error)
  })

  api.interceptors.response.use((response) => {
    if (response.config.url !== REFRESH_TOKEN_URL) {
      requestCount.value--
    }

    return response
  }, (error) => {
    if (error.config.url !== REFRESH_TOKEN_URL) {
      requestCount.value--
    }
    return Promise.reject(error)
  })

  api.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (err) => {
      requestCount.value--

      const originalConfig = err.config
      const isAuthErr = err.response?.status === 401

      if (!isAuthErr || originalConfig._retry)
        return Promise.reject(err)

      originalConfig._retry = true

      const router = useRouter()

      try {
        originalConfig.headers.Authorization = await refreshToken()
        return api(originalConfig)
      }
      catch (e) {
        resetTokens()
        await router.push('/auth')
        return Promise.reject(e)
      }
    },
  )

  return { api, baseUrl, tokensStore, resetTokens, requestCount, refreshToken, refreshTokenWithTimeLimit }
}
