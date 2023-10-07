import { IsNumber } from 'class-validator'

export class AdjustmentDto {
  @IsNumber()
  diff: number
}
