import { useActionsStore } from '~/store/actions'

export default defineNuxtRouteMiddleware(() => {
  const actionsStore = useActionsStore()
  actionsStore.$reset()
})
