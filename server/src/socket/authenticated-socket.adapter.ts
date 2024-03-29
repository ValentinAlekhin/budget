import { INestApplicationContext } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { AuthService } from 'src/auth/auth.service'
import { SocketServerI } from '../common/socket/socket.types'

export class AuthenticatedSocketAdapter extends IoAdapter {
  private readonly authService: AuthService
  constructor(private app: INestApplicationContext) {
    super(app)
    this.authService = this.app.get(AuthService)
  }

  createIOServer(port: number, options?: any) {
    const server: SocketServerI = super.createIOServer(port, options)

    server.use(async (socket: any, next) => {
      const token: string = socket.handshake?.auth?.token

      if (!token) {
        return next(new Error('Token not provided'))
      }

      try {
        socket.data.user = await this.authService.authenticateToken(token)
        return next()
      } catch (e: any) {
        return next(new Error(e))
      }
    })
    return server
  }
}
