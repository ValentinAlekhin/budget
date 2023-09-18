import {CategoryTypeEnum} from '../../server/src/record/record.entity'

export interface RecordDto {
    id: string;
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    timestamp: string
    type: CategoryTypeEnum
    amount: number
    comment?: string | null
    categoryId: string
}