import { OmitType } from '@nestjs/swagger'
import { CategoryEntity } from '@app/category/category.entity'

export class CreateCategoryDto extends OmitType(CategoryEntity, [
  'id',
  'user',
  'createdAt',
  'updatedAt',
] as const) {}
