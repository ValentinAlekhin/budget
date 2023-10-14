import { useSocketStore } from '~/store/socket'
import { useNotify } from '~/composables/useNotify'

export interface CudControllerOptions {
  action: string
  dataField?: string
}

interface Item {
  id: string
}

export interface CudActions {
  cudInit(): void
  cud_update(payload: Item): void
  cud_delete(payload: Item): void
  cud_create(payload: Item): void
  cud_update_many(payload: Item[]): void
  cud_delete_many(payload: Item[]): void
  cud_create_many(payload: Item[]): void
}

const defaultOptions: CudControllerOptions = {
  action: '',
  dataField: 'data',
}

export const cudController = (opt: CudControllerOptions): CudActions => {
  const { action, dataField }: CudControllerOptions = {
    ...defaultOptions,
    ...opt,
  }

  if (!dataField) throw new Error('Нет поля даты')

  return {
    cudInit() {
      const socketStore = useSocketStore()
      if (socketStore.socket) {
        socketStore.socket.on(
          action,
          ({
            info: { type, many },
            payload,
          }: {
            info: { type: 'update' | 'delete' | 'create'; many: boolean }
            payload: Item | Item[]
          }) => this[`cud_${type}${many ? '_many' : ''}`](payload),
        )
      } else {
        console.error('No socket')
      }
    },
    cud_update(payload) {
      this[dataField] = this[dataField].map((item) =>
        item.id === payload.id ? payload : item,
      )
    },
    cud_delete({ id }) {
      const notify = useNotify()

      if (!id) return notify.error('TEC: Нет id в экшене cud_delete')

      this[dataField] = this[dataField].filter((item) => item.id !== id)
    },
    cud_create(payload) {
      this[dataField] = [payload, ...this[dataField]]
    },
    cud_create_many(payload) {
      this[dataField] = [...payload, ...this[dataField]]
    },
    cud_update_many(payload) {
      this[dataField] = this[dataField].map((item) => {
        const newItem = payload.find(({ id }) => item.id === id)

        return newItem || item
      })
    },
    cud_delete_many(payload) {
      const ids = payload.map(({ id }) => id)
      this[dataField] = this[dataField].filter((item) => !ids.includes(item.id))
    },
  }
}
