import * as path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Telegraf } from 'telegraf'
import { InjectBot } from 'nestjs-telegraf'
import { ConfigService } from '@nestjs/config'
import * as dayjs from 'dayjs'
import { path as appRootPath } from 'app-root-path'
import * as fs from 'fs-extra'
import { Cron, CronExpression } from '@nestjs/schedule'

const promiseExec = promisify(exec)

@Injectable()
export class TelegramService implements OnModuleInit {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(TelegramService.name)

  async onModuleInit() {
    const adminId = +this.configService.get<string>('BOT_ADMIN')
    await this.bot.telegram.sendMessage(adminId, 'Server started')
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.backup()
  }

  async backup() {
    this.logger.debug('Backup')
    const adminId = +this.configService.get<string>('BOT_ADMIN')
    const { filename, source } = this.getFileName()

    try {
      await promiseExec(this.getExecCmd(source))
      setTimeout(() => fs.unlink(source), 2000)

      await this.bot.telegram.sendDocument(adminId, {
        source,
        filename,
      })
    } catch (e) {
      this.logger.error(e)
    }
  }
  private getFileName() {
    const filename = `database-backup-${dayjs().toISOString()}.tar`
    return { source: path.join(appRootPath, filename), filename }
  }

  private getExecCmd(src: string): string {
    const user = this.configService.get<string>('DB_USERNAME')
    const port = this.configService.get<string>('DB_PORT')
    const name = this.configService.get<string>('DB_NAME')
    const pass = this.configService.get<string>('DB_PASSWORD')
    const host = this.configService.get<string>('DB_HOST')

    return `pg_dump 'postgresql://${user}:${pass}@${host}:${port}/${name}' -f ${src} -F t`
  }
}
