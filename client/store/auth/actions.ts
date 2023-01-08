import { ElNotification } from 'element-plus'
import { api } from '~/api'

export default {
  async login(credentials: { username: string, password: string }) {
    try {
      const { data } = await api.post('/auth/login', credentials, { withCredentials: true })

      console.log(data)

      this.user = data

      const cookie = useCookie('accessToken')
      cookie.value = data.access_token

      ElNotification({ title: 'Вы вошли', type: 'success' })

      api.defaults.headers.common.Authorization =  `Bearer ${data.access_token}`

      const router = useRouter()
      router.push({ path: '/' })

      console.log('done')
    } catch (e) {
      console.log(e)
      ElNotification({ title: 'Ошибка', message: String(e), type: 'error' })
    }
  },
  logout() {
    this.$reset()

    const cookie = useCookie('_auth.token')
    cookie.value = null
  },
  async register(credentials: { username: string, password: string, email: string }) {
    try {
      await api.post('/user', credentials)
      await this.login(credentials)
    } catch (e) {
      ElNotification({ title: 'Ошибка', message: String(e), type: 'error' })
    }
  },
  async getMe() {
    try {
      const { data } = await api.post('/auth/me')

      this.user = data
    } catch (e) {
      console.log(e)
    }
  }
}