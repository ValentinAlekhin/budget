import { OmitType } from '@nestjs/swagger'
import { CategoryEntity } from '@app/category/category.entity'
import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

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
