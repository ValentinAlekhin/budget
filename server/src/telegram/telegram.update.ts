import { Command, Update } from 'nestjs-telegraf'
import { UseGuards } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { AdminGuard } from './guards/admin.guard'

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}
  @Command('backup')
  @UseGuards(AdminGuard)
  backupCmd() {
    return this.telegramService.backup()
  }
}
