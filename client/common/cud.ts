import { useSocketStore } from '~/store/socket'

export interface CudControllerOptions {
  entity: 'record' | 'category'
  dataField?: string
}

interface Item {
  id: string
}

interface CudAction {
  type: 'cud'
  timestamp: string
  payload: {
    action: 'create' | 'update' | 'delete'
    entity: 'record' | 'category'
    list: Item[]
  }
}

export interface CudActions {
  cudInit(): void
  cud_update(payload: Item[]): void
  cud_delete(payload: Item[]): void
  cud_create(payload: Item[]): void
}

const defaultOptions: CudControllerOptions = {
  entity: 'record',
  dataField: 'data',
}

export const cudController = (opt: CudControllerOptions): CudActions => {
  const { entity, dataField }: CudControllerOptions = {
    ...defaultOptions,
    ...opt,
  }

  if (!dataField) throw new Error('Нет поля даты')

  return {
    cudInit() {
      const { socketStore } = useSocketStore()
      if (socketStore.socket) {
        socketStore.socket.addEventListener('message', (msg) => {
          const data = JSON.parse(msg.data) as CudAction
          if (data.type !== 'cud') return
          if (data.payload.entity !== entity) return

          const fn = this[`cud_${data.payload.action}`]
          if (typeof fn !== 'function') return

          fn(data.payload.list)
        })
      } else {
        console.error('No socket')
      }
    },
    cud_create(payload) {
      this[dataField] = [...payload, ...this[dataField]]
    },
    cud_update(payload) {
      this[dataField] = this[dataField].map((item) => {
        const newItem = payload.find(({ id }) => item.id === id)

        return newItem || item
      })
    },
    cud_delete(payload) {
      const ids = payload.map(({ id }) => id)
      this[dataField] = this[dataField].filter((item) => !ids.includes(item.id))
    },
  }
}
