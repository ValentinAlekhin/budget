import { defineStore } from 'pinia'

interface State {
  user: null | PureUserDto
  token: string | any
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(credentials: LoginRequestDto) {
      const notify = useNotify()

      try {
        const { api, tokensStore } = useApi()

        const { data } = await api.post<LoginResponseDto>(
          '/auth/login',
          credentials,
          {
            withCredentials: true,
          },
        )

        tokensStore.value = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }

        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`

        this.token = data.accessToken
        await this.getMe()

        const router = useRouter()
        await router.push({ path: '/' })

        const { fetchAll } = useGlobalLoading()
        await fetchAll()
      }

      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (e) {
        notify.error('Невалидные данные')
      }
    },
    async logout() {
      const { resetTokens } = useApi()
      const { socketStore } = useSocketStore()

      this.$reset()
      resetTokens()

      const { api, tokensStore } = useApi()
      await api.post<LoginResponseDto>(
        '/auth/logout',
        { refreshToken: tokensStore.value.refreshToken },
      )

      const router = useRouter()
      router.push({ path: '/auth' })
      socketStore.close()
    },
    async register(credentials: {
      username: string
      password: string
      email: string
    }) {
      const { api } = useApi()
      const notify = useNotify()

      try {
        await api.post('/user', credentials)
        await this.login(credentials)
      }

      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (e) {
        notify.error('Ошибка при регистарции')
      }
    },
    async getMe() {
      const { api } = useApi()
      const { data } = await api.get('/auth/me')

      this.user = data
    },
  },
  getters: {},
})
