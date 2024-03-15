import { acceptHMRUpdate, defineStore } from 'pinia'
import { RecordDto } from '../../../common/dto/record'
import { cudController } from '~/common/cud'
import { useNotify } from '~/composables/useNotify'
import { generatePiniaLocalStorageKey } from '~/utils'

interface State {
  data: RecordDto[]
  loading: boolean
  error: Error | null | unknown
}

export const useRecordStore = defineStore('record', {
  state: (): State => ({
    data: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll({ force = false }) {
      if (!force && this.data?.length) return

      const { api } = useApi()
      const notify = useNotify()

      this.loading = true
      this.error = null

      try {
        const { data } = await api.get('/records')
        this.data = data
      } catch (e) {
        notify.error('Ошибка при загрузке записей')
        this.error = e
      } finally {
        this.loading = false
      }
    },
    async init() {
      await this.cudInit()
      await this.fetchAll({ force: true })
    },
    async addRecord(cost: { name: string; comment: string }) {
      const { api } = useApi()
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
      const { api } = useApi()
      await api.post('/records/many', { data })
    },
    async delete(id: string) {
      const { api } = useApi()
      await api.delete(`/records/${id}`)
    },

    async update(body: any) {
      const { api } = useApi()
      await api.put(`/records/${body.id}`, body)
    },
    async adjustmentBalance(diff: number) {
      const { api } = useApi()
      await api.post('/records/adjustment', { diff })
    },
    ...cudController({ action: 'records' }),
  },
  getters: {
    costs: (state: State) => state.data.filter((r) => r.type === 'cost'),
    dist: (state: State) => state.data.filter((r) => r.type === 'dist'),
    inc: (state: State) => state.data.filter((r) => r.type === 'inc'),
    adjustment: (state: State) =>
      state.data.filter((r) => r.type === 'adjustment'),
  },
  persist: {
    storage: persistedState.localStorage,
    key: generatePiniaLocalStorageKey,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRecordStore, import.meta.hot))
}
