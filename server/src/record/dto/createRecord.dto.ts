import { OmitType } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { IsULID } from '@yuzu441/is-ulid'
import { RecordEntity } from '../record.entity'

export class CreateRecordDto extends OmitType(RecordEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'category',
  'deletedAt',
] as const) {
  @IsString()
  @IsULID()
  category: string
}
