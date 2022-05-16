import { OmitType } from '@nestjs/swagger'
import { UserEntity } from '@app/user/user.entity'

export class UserType extends OmitType(UserEntity, ['password'] as const) {}
