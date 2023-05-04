import { PickType } from '@nestjs/swagger'
import { UserEntity } from '../../user/user.entity'

export class LoginUserDto extends PickType(UserEntity, [
  'password',
  'username',
] as const) {}
