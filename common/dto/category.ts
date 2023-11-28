import {CategoryTypeEnum} from '../../server/src/category/category.entity'
import {CategoryPlanPeriodEnum} from '../../server/src/common/enum'

export interface CategoryDto {
    id: string
    name: string
    comment: string
    order: number
    icon?: string | null
    color?: string | null
    plan?: number | null
    planPeriod: CategoryPlanPeriodEnum
    type: CategoryTypeEnum
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}
