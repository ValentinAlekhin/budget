import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CacheModule } from '@nestjs/cache-manager'
import { TelegrafModule } from 'nestjs-telegraf'
import { ScheduleModule } from '@nestjs/schedule'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { RecordModule } from './record/record.module'
import { UserModule } from './user/user.module'
import { validationOptions, validationSchema } from './config'
import { BackupModule } from './backup/backup.module'
import { TelegramModule } from './telegram/telegram.module'
import { SocketsGateway } from './socket/sockets.gateway'
import { ormconfig } from './ormconfig'

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
