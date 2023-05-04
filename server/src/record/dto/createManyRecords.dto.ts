import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateRecordDto } from './createRecord.dto'

export class CreateManyRecordsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecordDto)
  data: CreateRecordDto[]
}
