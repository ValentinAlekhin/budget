import { OmitType } from '@nestjs/swagger'
import { UserEntity } from '../user.entity'

export class UserType extends OmitType(UserEntity, ['password'] as const) {}
