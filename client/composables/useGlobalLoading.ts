export function useGlobalLoading() {
  const authStore = useAuthStore()
  const { socketStore } = useSocketStore()
  const { categoryStore } = useCategoryStore()
  const { recordStore } = useRecordStore()

  const initSocket = () => socketStore.init()

  const fetchAll = async () => {
    if (!authStore.user) return
    await Promise.all([categoryStore.init(), recordStore.init()])
  }

  const loading = computed(() => categoryStore.loading || recordStore.loading)
  const dataExists = computed(
    () => categoryStore.data.length && recordStore.data.length,
  )
  const error = computed(() => categoryStore.error || recordStore.error)

  return { fetchAll, initSocket, loading, error, dataExists }
}
