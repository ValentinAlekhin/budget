import { Module } from '@nestjs/common'
import { TelegramUpdate } from '@app/telegram/telegram.update'
import { TelegramService } from '@app/telegram/telegram.service'

@Module({
  providers: [TelegramUpdate, TelegramService],
})
export class TelegramModule {}
