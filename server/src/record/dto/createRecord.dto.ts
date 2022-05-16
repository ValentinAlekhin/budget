import { OmitType } from '@nestjs/swagger'
import { RecordEntity } from '@app/record/record.entity'
import { IsNumber, Min } from 'class-validator'

export class CreateRecordDto extends OmitType(RecordEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'category',
  'user',
] as const) {
  @IsNumber()
  @Min(0)
  category: number
}
