import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ormconfig } from '@app/ormconfig'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { validationOptions, validationSchema } from '@app/config'
import { BackupModule } from '@app/backup/backup.module'
import { CacheModule } from '@nestjs/cache-manager'
import { SocketsGateway } from '@app/socket/sockets.gateway'
import { TelegrafModule } from 'nestjs-telegraf'
import { TelegramModule } from '@app/telegram/telegram.module'
import { ScheduleModule } from '@nestjs/schedule'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { RecordModule } from './record/record.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot({
      validationSchema,
      validationOptions,
      isGlobal: true,
    }),
    CacheModule.register({ isGlobal: true }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get('BOT_TOKEN'),
      }),
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    CategoryModule,
    RecordModule,
    BackupModule,
    TelegramModule,
  ],
  providers: [SocketsGateway],
})
export class AppModule {}
