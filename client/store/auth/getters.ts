import {useCookie} from '#app'

export default {
  token: () => {
    const { value } = useCookie('accessToken')

    return value
  },
  isLogin: () =>  {
    const { value } = useCookie('accessToken')

    return !!value
  },
}