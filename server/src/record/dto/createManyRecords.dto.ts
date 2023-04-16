import { CreateRecordDto } from '@app/record/dto/createRecord.dto'
import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateManyRecordsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecordDto)
  data: CreateRecordDto[]
}
