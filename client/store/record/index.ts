import { defineStore } from 'pinia'
import type { RecordDto } from '../../../common/dto/record'
import { cudController } from '~/common/cud'
import { useNotify } from '~/composables/useNotify'
import { generatePiniaLocalStorageKey } from '~/utils'

interface State {
  data: RecordDto[]
  loading: boolean
  error: Error | null | unknown
}

export const useRecordStore = createSharedComposable(function () {
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
        if (!force && this.data?.length) return

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
      ...cudController({ entity: 'record' }),
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
  })()

  const recordStoreRefs = storeToRefs(recordStore)

  return { recordStore, recordStoreRefs }
})
