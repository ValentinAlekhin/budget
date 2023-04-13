import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ormconfig } from '@app/ormconfig'
import { ConfigModule } from '@nestjs/config'
import { validationOptions, validationSchema } from '@app/config'
import { BackupModule } from '@app/backup/backup.module'
import { CacheModule } from '@nestjs/cache-manager'
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
    UserModule,
    AuthModule,
    CategoryModule,
    RecordModule,
    BackupModule,
  ],
})
export class AppModule {}
