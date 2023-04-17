import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { SocketServerI } from '@app/common/socket/socket.types'
import { CategoryEntity } from '@app/category/category.entity'

interface ActionInfo {
  type: 'update' | 'delete' | 'create'
  many: boolean
}

@WebSocketGateway()
export class CategoryGateway implements OnGatewayConnection {
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
    return this.sockets
      .filter((c) => c.data.user.id === id)
      .forEach((c) => c.emit('category', { info, payload }))
  }
}
