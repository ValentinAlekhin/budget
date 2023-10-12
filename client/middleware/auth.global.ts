import { useAuthStore } from '~/store/auth'
import { useGlobalLoading } from '~/composables/useGlobalLoading'

export default defineNuxtRouteMiddleware(async (to) => {
  const { api, tokensStore } = useApi()
  const toAuth = to.path.includes('auth')
  const authStore = useAuthStore()

  const token = tokensStore.value.accessToken

  if (!token && !toAuth) return navigateTo('/auth')

  api.defaults.headers.common.Authorization = `Bearer ${token}`

  const { fetchAll } = useGlobalLoading()

  try {
    if (authStore.user) return
    if (token) {
      await authStore.getMe()
      fetchAll()

      if (toAuth) return navigateTo('/')
    }
  } catch (e) {
    authStore.logout()
    return navigateTo('/auth')
  }
})
