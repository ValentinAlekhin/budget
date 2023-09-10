import {CategoryTypeEnum} from '../../server/src/category/category.entity'

export interface CategoryDto {
    id: string
    name: string
    comment: string
    order: number
    icon?: string | null
    type: CategoryTypeEnum
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}