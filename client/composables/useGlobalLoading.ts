import { useCategoryStore } from '~/store/category'
import { useRecordStore } from '~/store/record'
import { useSocketStore } from '~/store/socket'
import { useAuthStore } from '~/store/auth'

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
  console.log(dataExists.value, 'dataExists')
  const error = computed(() => categoryStore.error || recordStore.error)

  return { fetchAll, initSocket, loading, error, dataExists }
}
