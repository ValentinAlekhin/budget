import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'
import { useNotify } from '~/composables/useNotify'

interface State {
  socket: null | Socket
  connected: boolean
}

export const useSocketStore = defineStore('socket', {
  state: (): State => ({ socket: null, connected: true }),
  actions: {
    init() {
      const notify = useNotify()
      const { tokensStore } = useApi()

      this.socket = io('/', {
        auth: {
          token: tokensStore.value.accessToken,
        },
      })

      this.socket.on('connect', () => {
        if (!this.connected)
          notify.success('Восстановлено соединение с сервером')
        this.connected = true
      })
      this.socket.on('disconnect', () => {
        this.connected = false
        notify.error('Потеряно соединение с сервером')
      })
    },
  },
})
