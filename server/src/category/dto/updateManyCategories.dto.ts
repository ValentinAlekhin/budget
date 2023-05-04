import { OmitType } from '@nestjs/swagger'
import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CategoryEntity } from '../category.entity'

class UpdateOneCategoryDto extends OmitType(CategoryEntity, [
  'user',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const) {}

export class UpdateManyCategoriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOneCategoryDto)
  data: UpdateOneCategoryDto[]
}
