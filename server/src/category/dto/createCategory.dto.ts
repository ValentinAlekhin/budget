import { OmitType } from '@nestjs/swagger'
import { CategoryEntity } from '../category.entity'

export class CreateCategoryDto extends OmitType(CategoryEntity, [
  'id',
  'user',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const) {}
