import { defineStore, storeToRefs } from 'pinia'
import { useNotify } from '~/composables/useNotify'

interface State {
  socket: null | WebSocket
  connected: boolean
}

export const useSocketStore = createSharedComposable(function () {
  const {
    public: { domain, websocketProtocol },
  } = useRuntimeConfig()
  const notify = useNotify()
  const { tokensStore } = useApi()
  const cookieToken = useCookie('token')

  const socketStore = defineStore('socket', {
    state: (): State => ({ socket: null, connected: true }),
    actions: {
      init() {
        cookieToken.value = tokensStore.value.accessToken
        this.socket = new WebSocket(`${websocketProtocol}://${domain}/ws`)

        this.socket.addEventListener('open', () => {
          if (!this.connected)
            notify.success('Восстановлено соединение с сервером')
          this.connected = true
        })

        this.socket.addEventListener('close', () => {
          if (!this.connected) return

          this.connected = false
          notify.error('Потеряно соединение с сервером')
        })

        this.socket.addEventListener('message', (msg) => {
          const data = JSON.parse(msg.data)
          console.log(data)
        })
      },
      close() {
        this.connected = false
        this.socket?.close()
      },
    },
  })()

  const socketStoreRef = storeToRefs(socketStore)

  return { socketStore, socketStoreRef }
})
