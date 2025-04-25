type Item = RecordResponseDto | CategoryResponseDto | TagResponseDto

interface CudAction<T extends Item> {
  type: 'cud'
  timestamp: string
  payload: {
    action: 'create' | 'update' | 'delete'
    entity: 'record' | 'category'
    list: T[]
  }
}

interface Parameters<T extends Item> {
  items: Ref<T[]>
  setter: (items: T[]) => void
  entity: 'record' | 'category' | 'tag'
}

export function useCud<T extends Item>({
  items,
  entity,
  setter,
}: Parameters<T>) {
  const { socketStoreRef } = useSocketStore()

  const actions = {
    create(payload: T[]) {
      const newData = [...payload, ...items.value]
      setter(newData)
    },
    update(payload: T[]) {
      const newData = items.value.map((item) => {
        const newItem = payload.find(({ id }) => item.id === id)

        return newItem || item
      })
      setter(newData)
    },
    delete(payload: T[]) {
      const ids = payload.map(({ id }) => id)
      const newData = items.value.filter(item => !ids.includes(item.id))
      setter(newData)
    },
  }

  const init = () => {
    socketStoreRef.socket.value?.addEventListener('message', (msg) => {
      const data = JSON.parse(msg.data) as CudAction<T>

      if (data.type !== 'cud')
        return
      if (data.payload.entity !== entity)
        return

      const fn = actions[data.payload.action]
      if (typeof fn !== 'function')
        return

      fn(data.payload.list)
    })
  }

  watch(socketStoreRef.socket, () => {
    init()
  })

  onMounted(() => {
    init()
  })
}
