/* eslint: console none */

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
  let reconnectInterval: NodeJS.Timeout | null = null

  const socketStore = defineStore('socket', {
    state: (): State => ({
      socket: null,
      connected: false,
    }),
    actions: {
      connect() {
        return new Promise<void>((resolve, reject) => {
          if (this.connected && this.socket?.readyState === WebSocket.OPEN) {
            return resolve()
          }

          this.socket = new WebSocket(`${websocketProtocol}://${domain}/ws`)

          this.socket.onopen = () => {
            this.connected = true
            console.info('WebSocket connected')
            resolve()
          }

          this.socket.onerror = (err) => {
            console.error('WebSocket error:', err)
            reject(err)
          }

          this.socket.onclose = () => {
            if (this.connected) {
              this.close()
              this.tryReconnect()
            }
          }

          this.socket.onmessage = (msg) => {
            try {
              const data = JSON.parse(msg.data)
              console.info('WebSocket message:', data)
            }
            catch (e) {
              console.error('Invalid message:', msg.data)
            }
          }
        })
      },
      ping() {
        if (this.connected && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send('ping')
        }
      },
      async init() {
        try {
          await this.connect()
        }
        catch (e) {
          console.error(e)
          notify.error('Произошла ошибка при подключении к WebSocket')
        }
      },
      tryReconnect() {
        if (reconnectInterval)
          return

        let attempts = 0
        reconnectInterval = setInterval(async () => {
          if (attempts >= 10) {
            clearInterval(reconnectInterval!)
            reconnectInterval = null
            return
          }

          try {
            await this.init()
            clearInterval(reconnectInterval!)
            reconnectInterval = null
          }
          catch {
            attempts++
          }
        }, 5000)
      },
      close() {
        if (!this.connected)
          return

        this.connected = false
        this.socket?.close()
        this.socket = null
      },
    },
  })()

  useIntervalFn(socketStore.ping, 10000)

  const socketStoreRef = storeToRefs(socketStore)

  return { socketStore, socketStoreRef }
})
