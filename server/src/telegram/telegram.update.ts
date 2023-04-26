import { Command, Update } from 'nestjs-telegraf'
import { UseGuards } from '@nestjs/common'
import { AdminGuard } from '@app/telegram/guards/admin.guard'
import { TelegramService } from '@app/telegram/telegram.service'

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}
  @Command('backup')
  @UseGuards(AdminGuard)
  backupCmd() {
    return this.telegramService.backup()
  }
}
