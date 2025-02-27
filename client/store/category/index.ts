import { defineStore } from 'pinia'

export interface CategoryState {
  data: CategoryResponseDto[]
  loading: boolean
  error: any
}

export const useCategoryStore = createSharedComposable(() => {
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
          if (!force && this.data?.length)
            return

          const { data } = await api.get<CategoryResponseDto[]>('/category')
          this.data = data || []
        }
        catch (e) {
          notify.error('Ошибка при загрузке категорий')
          this.error = e
        }
        finally {
          this.loading = false
        }
      },
      async init() {
        await this.fetchAll({ force: true })
      },
      setData(data: CategoryResponseDto[]) {
        this.data = data
      },
      async addCategory(category: CreateCategoryRequestDto) {
        try {
          await api.post('/category', category)
        }
        catch (e) {
          notify.error('Ошибка при сохранении')
        }
      },
      async updateOne(dto: UpdateCategoryRequestDto) {
        try {
          await api.put(`/category/${dto.id}`, dto)
        }
        catch (e) {
          notify.error('Ошибка при обновлении категории')
        }
      },
      async updateMany(data: UpdateCategoryRequestDto[]) {
        try {
          await api.put('/category/many', { data })
        }
        catch (e) {
          notify.error('Ошибка при обновлении категорий')
        }
      },
      async delete(id: number) {
        try {
          await api.delete(`/category/${id}`)
        }
        catch (e) {
          notify.error('Ошибка при удалении')
        }
      },
    },
    getters: {
      costs: state =>
        state.data
          .filter(c => c.type === 'cost')
          .sort((a, b) => a.order - b.order),
      incoming: state =>
        state.data
          .filter(c => c.type === 'inc')
          .sort((a, b) => a.order - b.order),
      getById: state => (id: number): CategoryResponseDto | undefined => state.data.find(c => c.id === id),
    },
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  })()

  const categoryStoreRefs = storeToRefs(categoryStore)

  useCud<CategoryResponseDto>({
    items: categoryStoreRefs.data,
    entity: 'category',
    setter: categoryStore.setData,
  })

  return { categoryStore, categoryStoreRefs }
})
