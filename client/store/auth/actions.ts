import { useSocketStore } from '~/store/socket'

export default {
  async login(credentials: { username: string; password: string }) {
    const notify = useNotify()

    try {
      const { api, tokensStore } = useApi()

      const { data } = await api.post('/auth/login', credentials, {
        withCredentials: true,
      })

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
    } catch (e) {
      notify.error('Невалидные данные')
    }
  },
  logout() {
    const { resetTokens } = useApi()
    const { socketStore } = useSocketStore()

    this.$reset()
    resetTokens()

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
    } catch (e) {
      notify.error('Ошибка при регистарции')
    }
  },
  async getMe() {
    const { api } = useApi()
    const { data } = await api.get('/auth/me')

    this.user = data
  },
}
