import { defineStore } from 'pinia'

export interface TagStore {
  data: TagResponseDto[]
  loading: boolean
  error: any
}

export const useTagStore = createSharedComposable(() => {
  const { api } = useApi()
  const notify = useNotify()

  const tagStore = defineStore('tag', {
    state: (): TagStore => ({
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

          const { data } = await api.get<TagResponseDto[]>('/tag')
          this.data = data || []
        }
        catch (e) {
          console.error(e)
          notify.error('Ошибка при загрузке тегов')
          this.error = e
        }
        finally {
          this.loading = false
        }
      },
      async init() {
        await this.fetchAll({ force: true })
      },
      setData(data: TagResponseDto[]) {
        this.data = data
      },
      async create(category: CreateTagRequestDto) {
        try {
          await api.post('/tag', category)
        }
        catch (e) {
          console.error(e)
          notify.error('Ошибка при сохранении тега')
        }
      },
      async updateOne(dto: UpdateTagRequestDto) {
        try {
          await api.put(`/tag/${dto.id}`, dto)
        }
        catch (e) {
          console.error(e)
          notify.error('Ошибка при обновлении тега')
        }
      },
      async delete(id: number) {
        try {
          await api.delete(`/tag/${id}`)
        }
        catch (e) {
          console.error(e)
          notify.error('Ошибка при удалении тега')
        }
      },
    },
    getters: {
      getById: state => (id: number): TagResponseDto => state.data.find(c => c.id === id),
    },
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  })()

  const tagStoreRefs = storeToRefs(tagStore)

  useCud<TagResponseDto>({
    items: tagStoreRefs.data,
    entity: 'tag',
    setter: tagStore.setData,
  })

  return { tagStore, tagStoreRefs }
})
