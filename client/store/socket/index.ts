import { defineStore, storeToRefs } from 'pinia'

interface State {
  socket: null | WebSocket
  connected: boolean
}

export const useSocketStore = createSharedComposable(() => {
  const {
    public: { domain, websocketProtocol },
  } = useRuntimeConfig()
  const notify = useNotify()
  const { tokensStore } = useApi()
  const cookieToken = useCookie('token')
  let interval: NodeJS.Timeout

  const socketStore = defineStore('socket', {
    state: (): State => ({ socket: null, connected: true }),
    actions: {
      connect() {
        return new Promise<WebSocket>((resolve, reject) => {
          const token = tokensStore.value.accessToken
          if (!token) {
            throw new Error('No access token')
          }

          cookieToken.value = token
          const socket = new WebSocket(`${websocketProtocol}://${domain}/ws`)
          this.socket = socket

          this.socket.addEventListener('error', err => reject(err))

          this.socket?.addEventListener('open', () => {
            if (!this.connected)
              notify.success('Восстановлено соединение с сервером')
            this.connected = true
            resolve(socket)
          })
        })
      },
      subscribe() {
        this.socket?.addEventListener('open', () => {
          if (!this.connected)
            notify.success('Восстановлено соединение с сервером')
          this.connected = true
        })

        this.socket?.addEventListener('close', () => {
          if (!this.connected)
            return

          notify.error('Потеряно соединение с сервером')
          this.close()
          this.tryReconnect()
        })

        this.socket?.addEventListener('message', (msg) => {
          const data = JSON.parse(msg.data)
          console.log(data)
        })
      },
      setInterval() {
        interval = setInterval(() => this.socket?.send('ping'), 10000)
      },
      async init() {
        try {
          await this.connect()
          this.subscribe()
          this.setInterval()
        }
        catch (e) {
          notify.error('Произошла ошибка при подключени WS')
        }
      },
      tryReconnect() {
        let reconnectTries = 0
        const reconnectInterval = setInterval(async () => {
          if (reconnectTries >= 10) {
            clearInterval(reconnectTries)
            return
          }

          try {
            await this.init()
            clearInterval(reconnectInterval)
          }
          catch (e) {
            console.log(e)
            reconnectTries++
          }
        }, 5000)
      },
      close() {
        this.connected = false
        this.socket?.close()
        clearInterval(interval)
      },
    },
  })()

  const socketStoreRef = storeToRefs(socketStore)

  return { socketStore, socketStoreRef }
})
