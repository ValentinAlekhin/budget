import { UserType } from '@app/user/types/user.type'
import { ApiProperty } from '@nestjs/swagger'

export class AuthUserType {
  user: UserType

  @ApiProperty()
  accessToken: string
}
