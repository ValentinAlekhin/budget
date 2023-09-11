import { Server } from 'socket.io'
import { UserEntity } from '@app/user/user.entity'

interface ClientToServerEvents {
  hello: () => void
}

interface InterServerEvents {
  ping: () => void
}

interface SocketData {
  user: UserEntity
}

export type SocketServerI = Server<
  ClientToServerEvents,
  any,
  InterServerEvents,
  SocketData
>
