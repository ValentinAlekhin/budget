export default defineNuxtRouteMiddleware(() => {
  const actionsStore = useActionsStore()
  actionsStore.$reset()
})
