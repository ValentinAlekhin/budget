import { Body, Controller, Post } from '@nestjs/common'
import { UserService } from '@app/user/user.service'
import {
  UserEmailValidationRequestDto,
  UserUsernameValidationRequestDto,
  UserValidationResponseDto,
} from '@app/user/dto/filedValidations.dto'

@Controller('user-field-validation')
export class UserFiledValidationController {
  constructor(private readonly service: UserService) {}

  @Post('email')
  validateEmail(
    @Body() req: UserEmailValidationRequestDto,
  ): Promise<UserValidationResponseDto> {
    return this.service.validateEmail(req)
  }

  @Post('username')
  validateUsername(
    @Body() req: UserUsernameValidationRequestDto,
  ): Promise<UserValidationResponseDto> {
    return this.service.validateUsername(req)
  }
}
