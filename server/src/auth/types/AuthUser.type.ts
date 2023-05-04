import { ApiProperty } from '@nestjs/swagger'
import { UserType } from '../../user/types/user.type'

export class AuthUserType {
  user: UserType

  @ApiProperty()
  accessToken: string
}
