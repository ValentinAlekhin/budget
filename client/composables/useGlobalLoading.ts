import dayjs from 'dayjs'

export function useGlobalLoading() {
  const { refreshTokenWithTimeLimit } = useApi()
  const authStore = useAuthStore()
  const { socketStore } = useSocketStore()
  const { categoryStore } = useCategoryStore()
  const { recordStore } = useRecordStore()
  const { tagStore } = useTagStore()
  const visibility = useDocumentVisibility()

  const lastFetch = ref(dayjs())

  const initSocket = () => socketStore.init()

  const fetchAll = async () => {
    if (!authStore.user)
      return
    await Promise.all([categoryStore.init(), recordStore.init(), tagStore.init()])
    lastFetch.value = dayjs()
  }

  const loading = computed(() => categoryStore.loading || recordStore.loading || tagStore.loading)
  const dataExists = computed(
    () => categoryStore.data.length && recordStore.data.length && recordStore.data.length,
  )
  const error = computed(() => categoryStore.error || recordStore.error || tagStore.error)

  watch(visibility, async (v) => {
    if (!authStore.user)
      return

    if (v === 'visible') {
      await refreshTokenWithTimeLimit()
      await socketStore.init()
      if (dayjs().diff(lastFetch.value, 'minutes') > 1) {
        await fetchAll()
      }
    }
  })

  return { fetchAll, initSocket, loading, error, dataExists }
}
