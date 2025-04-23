/* Do not change, this code is generated from Golang structs */

export enum CategoriesTypeEnum {
  ADJUSTMENT = 'adjustment',
  COST = 'cost',
  INC = 'inc',
}
export enum CategoriesPlanPeriodEnum {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}
export interface Int8 {
  Int64: number
  Valid: boolean
}
export interface RecordResponseDto {
  id: number
  createdAt: string
  updatedAt: string
  amount: number
  comment: string
  timestamp: string
  categoryId: number
  deletedAt: string
  type: CategoriesTypeEnum
  tagId?: Int8
}
export interface CreateOneRecordRequestDto {
  amount: number
  comment: string
  categoryId: number
  timestamp: string
  tagId: number
}
export interface UpdateOneRecordRequestDto {
  id: number
  amount: number
  comment: string
  categoryId: number
  timestamp: string
  tagId: number
}
export interface CreateManyRecordsRequestDto {
  data: CreateOneRecordRequestDto[]
}
export interface AdjustmentRequestDto {
  diff: number
}
export interface CreateCategoryRequestDto {
  name: string
  type: CategoriesTypeEnum
  comment: string
  order: number
  plan: number
  planPeriod: CategoriesPlanPeriodEnum
  color: string
  icon: string
  tagIds: number[]
}
export interface UpdateCategoryRequestDto {
  id: number
  name: string
  type: CategoriesTypeEnum
  comment: string
  order: number
  plan: number
  planPeriod: CategoriesPlanPeriodEnum
  color: string
  icon: string
  tagIds: number[]
}
export interface UpdateManyCategoryRequestDto {
  data: UpdateCategoryRequestDto[]
}
export interface UpdateCategoryOrderRequestDto {
  id: number
  order: number
}
export interface UpdateManyCategoryOrderRequestDto {
  data: UpdateCategoryOrderRequestDto[]
}
export interface CategoryResponseDto {
  id: number
  createdAt: string
  updatedAt: string
  name: string
  type: CategoriesTypeEnum
  order: number
  comment: string
  userId: number
  deletedAt: string
  icon: string
  plan: number
  color: string
  planPeriod: CategoriesPlanPeriodEnum
  tagIds: number[]
}
export interface LoginRequestDto {
  username: string
  password: string
}
export interface PureUserDto {
  id: number
  username: string
  email: string
}
export interface LoginResponseDto {
  user: PureUserDto
  accessToken: string
  refreshToken: string
}
export interface RefreshTokenRequestDto {
  refreshToken: string
}
export interface RefreshTokenResponseDto {
  refreshToken: string
  accessToken: string
}
export interface TagResponseDto {
  id: number
  createdAt: string
  updatedAt: string
  name: string
  color: string
  icon: string
  deletedAt: string
}

export interface CreateTagRequestDto {
  name: string
  color: string
  icon: string
}
export interface UpdateTagRequestDto {
  id: number
  name: string
  color: string
  icon: string
}
