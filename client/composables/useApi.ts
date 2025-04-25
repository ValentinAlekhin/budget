import type { AxiosResponse } from 'axios'
import { useLocalStorage } from '@vueuse/core'
import axios from 'axios'

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

  watch(tokensStore, value => cookieToken.value = value.accessToken)

  const resetTokens = () =>
    (tokensStore.value = { accessToken: '', refreshToken: '' })

  const refreshToken = async (): Promise<string> => {
    const payload: RefreshTokenRequestDto = {
      refreshToken: tokensStore.value.refreshToken,
    }
    const { data } = await api.post<RefreshTokenResponseDto>(
      '/auth/refresh-tokens',
      payload,
    )

    tokensStore.value = {
      refreshToken: data.refreshToken,
      accessToken: data.accessToken,
    }

    const authHeader = `Bearer ${data.accessToken}`
    api.defaults.headers.common.Authorization = authHeader

    return authHeader
  }

  api.interceptors.request.use((config) => {
    requestCount.value++
    return config
  }, (error) => {
    requestCount.value++
    return Promise.reject(error)
  })

  api.interceptors.response.use((response) => {
    requestCount.value--
    return response
  }, (error) => {
    requestCount.value--
    return Promise.reject(error)
  })

  api.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (err) => {
      requestCount.value--

      const originalConfig = err.config
      const isAuthErr = err.response.status === 401

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

  return { api, baseUrl, tokensStore, resetTokens, requestCount, refreshToken }
}
