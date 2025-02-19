import { defineStore } from 'pinia'

interface State {
  data: RecordResponseDto[]
  loading: boolean
  error: Error | null | unknown
}

export const useRecordStore = createSharedComposable(() => {
  const { api } = useApi()
  const notify = useNotify()

  const recordStore = defineStore('record', {
    state: (): State => ({
      data: [],
      loading: false,
      error: null,
    }),
    actions: {
      async fetchAll({ force = false }) {
        if (!force && this.data?.length)
          return

        this.loading = true
        this.error = null

        try {
          const { data } = await api.get('/records')
          this.data = data
        }
        catch (e) {
          notify.error('Ошибка при загрузке записей')
          this.error = e
        }
        finally {
          this.loading = false
        }
      },
      async init() {
        await this.fetchAll({ force: true })
      },
      setData(data: RecordResponseDto[]) {
        this.data = data
      },
      async addRecord(cost: { name: string, comment: string }) {
        await api.post('/records', { ...cost, type: 'cost' })
      },
      async addRecords(
        data: Array<{
          amount: number
          comment?: string
          categoryId: string
          timestamp: string
        }>,
      ) {
        await api.post('/records/many', { data })
      },
      async delete(id: string) {
        await api.delete(`/records/${id}`)
      },

      async update(body: any) {
        await api.put(`/records/${body.id}`, body)
      },
      async adjustmentBalance(diff: number) {
        await api.post('/records/adjustment', { diff })
      },
    },
    getters: {
      costs: state =>
        state.data.filter(r => r.type === CategoriesTypeEnum.COST),
      inc: state =>
        state.data.filter(r => r.type === CategoriesTypeEnum.INC),
      adjustment: state =>
        state.data.filter(r => r.type === CategoriesTypeEnum.ADJUSTMENT),
    },
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  })()

  const recordStoreRefs = storeToRefs(recordStore)

  useCud<RecordResponseDto>({
    items: recordStoreRefs.data,
    entity: 'record',
    setter: recordStore.setData,
  })

  return { recordStore, recordStoreRefs }
})
