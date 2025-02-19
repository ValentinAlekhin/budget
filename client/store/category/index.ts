import { defineStore } from 'pinia'
import type { CategoryDto } from '../../../common/dto/category'

export interface CategoryState {
  data: CategoryDto[]
  loading: boolean
  error: any
}

export const useCategoryStore = createSharedComposable(function () {
  const { api } = useApi()
  const notify = useNotify()

  const categoryStore = defineStore('category', {
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

          const { data } = await api.get<CategoryDto[]>('/category')
          this.data = data || []
        } catch (e) {
          notify.error('Ошибка при загрузке категорий')
          this.error = e
        } finally {
          this.loading = false
        }
      },
      async init() {
        await this.fetchAll({ force: true })
      },
      setData(data: CategoryDto[]) {
        this.data = data
      },
      async addCategory(category: {
        name: string
        type: string
        order: number
      }) {
        try {
          await api.post('/category', category)
        } catch (e) {
          notify.error('Ошибка при сохранении')
        }
      },
      async updateMany(data: CategoryDto[]) {
        try {
          await api.put('/category/many', { data })
        } catch (e) {
          notify.error('Ошибка при обновлении категорий')
        }
      },
      async delete(id: string) {
        try {
          await api.delete(`/category/${id}`)
        } catch (e) {
          notify.error('Ошибка при удалении')
        }
      },
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
      persist: true,
      storage: piniaPluginPersistedstate.localStorage(),
    },
  })()

  const categoryStoreRefs = storeToRefs(categoryStore)

  useCud({
    items: categoryStoreRefs.data,
    entity: 'category',
    setter: categoryStore.setData,
  })

  return { categoryStore, categoryStoreRefs }
})
