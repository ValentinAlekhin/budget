export default defineNuxtRouteMiddleware(async (to) => {
  const { api, tokensStore } = useApi()
  const toAuth = to.path.includes('auth')

  const token = tokensStore.value.accessToken

  if (!token && !toAuth)
    return navigateTo('/auth')

  api.defaults.headers.common.Authorization = `Bearer ${token}`
})
