import { api } from '~/api'

export default defineNuxtRouteMiddleware((to) => {
  const { value: token } = useCookie('accessToken')
  const toAuth = to.path.includes('auth')
  console.log(token)
  if (!token && !toAuth) return navigateTo('/auth')

  api.defaults.headers.common.Authorization =  `Bearer ${token}`
})