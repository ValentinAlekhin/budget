import { OmitType } from '@nestjs/swagger'
import { RecordEntity } from '../record.entity'

export class RecordResponseDto extends OmitType(RecordEntity, [
  'category',
] as const) {
  category: string
}
