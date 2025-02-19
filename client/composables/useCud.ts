import { useSocketStore } from '~/store/socket'
import type { RecordDto } from '../../common/dto/record'
import type { CategoryDto } from '../../common/dto/category'

type Item = RecordDto | CategoryDto

interface CudAction {
  type: 'cud'
  timestamp: string
  payload: {
    action: 'create' | 'update' | 'delete'
    entity: 'record' | 'category'
    list: Item[]
  }
}

interface Parameters {
  items: Ref<Item[]>
  setter: (items: any[]) => any
  entity: 'record' | 'category'
}

export function useCud({ items, entity, setter }: Parameters) {
  const { socketStoreRef } = useSocketStore()

  const actions = {
    create(payload: Item[]) {
      const newData = [...payload, ...items.value]
      setter(newData)
    },
    update(payload: Item[]) {
      const newData = items.value.map((item) => {
        const newItem = payload.find(({ id }) => item.id === id)

        return newItem || item
      })
      setter(newData)
    },
    delete(payload: Item[]) {
      const ids = payload.map(({ id }) => id)
      const newData = items.value.filter((item) => !ids.includes(item.id))
      setter(newData)
    },
  }

  const init = () => {
    console.log('cud init', entity)
    socketStoreRef.socket.value?.addEventListener('message', (msg) => {
      const data = JSON.parse(msg.data) as CudAction

      if (data.type !== 'cud') return
      if (data.payload.entity !== entity) return

      const fn = actions[data.payload.action]
      if (typeof fn !== 'function') return

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
