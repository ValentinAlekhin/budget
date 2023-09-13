import { IsString } from 'class-validator'

export class UserEmailValidationRequestDto {
  @IsString()
  email: string
}

export class UserUsernameValidationRequestDto {
  @IsString()
  username: string
}

export class UserValidationResponseDto {
  valid: boolean
}
