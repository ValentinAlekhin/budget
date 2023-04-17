import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { SocketServerI } from '@app/common/socket/socket.types'
import { RecordResponseDto } from '@app/record/dto/recordResponse.dto'

interface ActionInfo {
  type: 'update' | 'delete' | 'create'
  many: boolean
}

@WebSocketGateway()
export class RecordGateway implements OnGatewayConnection {
  @WebSocketServer()
  public server: SocketServerI

  private sockets

  handleConnection() {
    this.setClients()
  }

  private setClients() {
    this.sockets = Array.from(
      this.server.sockets.sockets,
      ([_, value]) => value,
    )
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

  private emitByUserId(
    id: string,
    payload: RecordResponseDto | RecordResponseDto[],
    info: ActionInfo,
  ) {
    return this.sockets
      .filter((c) => c.data.user.id === id)
      .forEach((c) => c.emit('records', { info, payload }))
  }
}
