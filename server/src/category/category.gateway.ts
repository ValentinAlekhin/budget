import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { SocketServerI } from '../common/socket/socket.types'
import { CategoryEntity } from './category.entity'

interface ActionInfo {
  type: 'update' | 'delete' | 'create'
  many: boolean
}

@WebSocketGateway()
export class CategoryGateway implements OnGatewayConnection {
  private readonly logger = new Logger(CategoryGateway.name)

  @WebSocketServer()
  public server: SocketServerI

  private sockets

  handleConnection() {
    this.setClients()
  }

  createCategory(body: CategoryEntity, userId: string) {
    this.emitByUserId(userId, body, { many: false, type: 'create' })
  }

  createManyCategory(body: CategoryEntity[], userId: string) {
    this.emitByUserId(userId, body, { many: true, type: 'create' })
  }

  updateManyCategory(body: CategoryEntity[], userId: string) {
    this.emitByUserId(userId, body, { many: true, type: 'update' })
  }

  deleteCategory(body: CategoryEntity, userId: string) {
    this.emitByUserId(userId, body, { many: false, type: 'delete' })
  }

  updateCategory(body: CategoryEntity, userId: string) {
    this.emitByUserId(userId, body, { many: false, type: 'update' })
  }

  private emitByUserId(
    id: string,
    payload: CategoryEntity | CategoryEntity[],
    info: ActionInfo,
  ) {
    try {
      return this.sockets
        .filter((c) => c.data.user.id === id)
        .forEach((c) => c.emit('category', { info, payload }))
    } catch (e) {
      this.logger.error(e)
    }
  }

  private setClients() {
    const sockets = Array.from(
      this.server.sockets.sockets,
      ([_, value]) => value,
    )

    Array.isArray(sockets) ? (this.sockets = sockets) : (this.sockets = [])
  }
}
