import { api } from '~/api'
import {useAuthStore} from '~/store/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const toAuth = to.path.includes('auth')

  console.log(authStore.token)
  if (!authStore.token && !toAuth) return navigateTo('/auth')

  api.defaults.headers.common.Authorization =  `Bearer ${authStore.token}`
})