import { PickType } from '@nestjs/swagger'
import { UserEntity } from '@app/user/user.entity'

export class CreateUserDto extends PickType(UserEntity, [
  'password',
  'email',
  'username',
] as const) {}
