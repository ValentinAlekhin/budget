import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserFiledValidationController } from '@app/user/user-filed-validation.controller'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserEntity } from './user.entity'

@Module({
  providers: [UserService],
  controllers: [UserController, UserFiledValidationController],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UserService],
})
export class UserModule {}
