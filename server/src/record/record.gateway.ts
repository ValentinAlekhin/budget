import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { SocketServerI } from '../common/socket/socket.types'
import { RecordResponseDto } from './dto/recordResponse.dto'

interface ActionInfo {
  type: 'update' | 'delete' | 'create'
  many: boolean
}

@WebSocketGateway()
export class RecordGateway implements OnGatewayConnection {
  private readonly logger = new Logger(RecordGateway.name)

  @WebSocketServer()
  public server: SocketServerI

  private sockets

  handleConnection() {
    this.setClients()
  }

  private setClients() {
    const sockets = Array.from(
      this.server.sockets.sockets,
      ([_, value]) => value,
    )

    Array.isArray(sockets) ? (this.sockets = sockets) : (this.sockets = [])
  }

  createRecord(body: RecordResponseDto, userId: string) {
    this.emitByUserId(userId, body, { many: false, type: 'create' })
  }

  createManyRecord(body: RecordResponseDto[], userId: string) {
    this.emitByUserId(userId, body, { many: true, type: 'create' })
  }

  deleteRecord(body: RecordResponseDto, userId: string) {
    this.emitByUserId(userId, body, { many: false, type: 'delete' })
  }

  updateRecord(body: RecordResponseDto, userId: string) {
    this.emitByUserId(userId, body, { many: false, type: 'update' })
  }

  deleteManyRecords(body: RecordResponseDto, userId: string) {
    this.emitByUserId(userId, body, { many: true, type: 'delete' })
  }

  private emitByUserId(
    id: string,
    payload: RecordResponseDto | RecordResponseDto[],
    info: ActionInfo,
  ) {
    try {
      return this.sockets
        .filter((c) => c.data.user.id === id)
        .forEach((c) => c.emit('records', { info, payload }))
    } catch (e) {
      this.logger.error(e)
    }
  }
}
