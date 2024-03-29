import { PickType } from '@nestjs/swagger'
import { UserEntity } from '../user.entity'

export class CreateUserDto extends PickType(UserEntity, [
  'password',
  'email',
  'username',
] as const) {}
