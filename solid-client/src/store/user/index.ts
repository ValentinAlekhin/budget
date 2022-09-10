import { createStore } from 'solid-js/store'
import { axios } from '../../api'
import { toast } from 'solid-toast'

interface UserStore {
  id: number
  email: string
  username: string
  accessToken: string
}

interface ILogin {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
}

interface MeResponse {
  id: number
  username: string
  email: string
}

const [userState, setState] = createStore<UserStore>({
  id: 0,
  email: '',
  username: '',
  accessToken: '',
})

const setToken = (token: string) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
  localStorage.setItem('accessToken', token)
  setState('accessToken', token)
}

export const getMe = async () => {
  if (!userState.accessToken) return

  const { data } = await axios.get<MeResponse>('/auth/me')

  setState(data)
}

export const init = async () => {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) return

  try {
    setToken(accessToken)
    await getMe()
  } catch (e) {
    console.log(e)
  }
}

export const login = async ({ email, password }: ILogin) => {
  if (!email || !password) return

  try {
    const { data } = await axios.post<LoginResponse>('/auth/login', {
      email,
      password,
    })

    setToken(data.accessToken)

    await getMe()
  } catch (e) {
    // @ts-ignore
    if (e?.response?.status === 401) return toast.error('Неправильные данные')

    return toast.error('Произошла ошибка не сервере')
    console.log(e)
  }
}

export { userState }
