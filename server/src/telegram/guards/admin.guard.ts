import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { TelegrafExecutionContext } from 'nestjs-telegraf'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = TelegrafExecutionContext.create(context)
    const { from } = ctx.getContext()

    const adminId = +this.configService.get<string>('BOT_ADMIN')

    return adminId === from.id
  }
}
