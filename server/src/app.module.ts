import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ormconfig } from '@app/ormconfig'
import { ConfigModule } from '@nestjs/config'
import { validationOptions, validationSchema } from '@app/config'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { RecordModule } from './record/record.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot({
      validationSchema,
      validationOptions,
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    RecordModule,
  ],
})
export class AppModule {}
