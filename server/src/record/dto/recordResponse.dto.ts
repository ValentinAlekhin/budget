import { RecordEntity } from '@app/record/record.entity'
import { OmitType } from '@nestjs/swagger'

export class RecordResponseDto extends OmitType(RecordEntity, [
  'category',
  'user',
] as const) {
  category: string
}
