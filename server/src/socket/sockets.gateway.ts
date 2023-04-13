import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway()
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server

  handleConnection(@ConnectedSocket() client: any) {}

  handleDisconnect(@ConnectedSocket() client: any) {}
}
