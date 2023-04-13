import { OmitType } from '@nestjs/swagger'
import { RecordEntity } from '@app/record/record.entity'
import { IsString } from 'class-validator'
import { IsULID } from '@yuzu441/is-ulid'

export class UpdateRecordDto extends OmitType(RecordEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'category',
] as const) {
  @IsString()
  @IsULID()
  category: string
}
