import { acceptHMRUpdate, defineStore } from 'pinia'
import type { CategoryDto } from '../../../common/dto/category'
import { useNotify } from '~/composables/useNotify'
import { cudController } from '~/common/cud'
import { generatePiniaLocalStorageKey } from '~/utils'

export interface CategoryState {
  data: CategoryDto[]
  loading: boolean
  error: any
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    data: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll({ force = false }) {
      this.loading = true
      this.error = null

      try {
        if (!force && this.data?.length) return

        const { api } = useApi()
        const { data } = await api.get<CategoryDto[]>('/category')
        this.data = data || []
      } catch (e) {
        const notify = useNotify()
        notify.error('Ошибка при загрузке категорий')
        this.error = e
      } finally {
        this.loading = false
      }
    },
    async init() {
      await this.cudInit()
      await this.fetchAll({ force: true })
    },
    async addCategory(category: { name: string; type: string; order: number }) {
      const { api } = useApi()
      try {
        await api.post('/category', category)
      } catch (e) {
        const notify = useNotify()
        notify.error('Ошибка при сохранении')
      }
    },
    async updateMany(data: CategoryDto[]) {
      const { api } = useApi()
      try {
        await api.put('/category/many', { data })
      } catch (e) {
        const notify = useNotify()
        notify.error('Ошибка при обновлении категорий')
      }
    },
    async delete(id: string) {
      const { api } = useApi()
      try {
        await api.delete(`/category/${id}`)
      } catch (e) {
        const notify = useNotify()
        notify.error('Ошибка при удалении')
      }
    },
    ...cudController({ entity: 'category' }),
  },
  getters: {
    costs: (state) =>
      state.data
        .filter((c) => c.type === 'cost')
        .sort((a, b) => a.order - b.order),
    incoming: (state) =>
      state.data
        .filter((c) => c.type === 'inc')
        .sort((a, b) => a.order - b.order),
    getById: (state) => (id: string) =>
      state.data.find((c) => c.id === id) as CategoryDto,
  },
  persist: {
    storage: persistedState.localStorage,
    key: generatePiniaLocalStorageKey,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot))
}
