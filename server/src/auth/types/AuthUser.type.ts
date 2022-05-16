import { UserType } from '@app/user/types/user.type'
import { ApiProperty } from '@nestjs/swagger'

export class AuthUserType extends UserType {
  @ApiProperty()
  access_token: string
}
