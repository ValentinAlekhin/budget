import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsEnum, IsNumber } from 'class-validator'
import { CategoryEntity, CategoryTypeEnum } from '@app/category/category.entity'
import { UserEntity } from '@app/user/user.entity'

@Entity('records')
export class RecordEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsEnum(CategoryTypeEnum)
  type: CategoryTypeEnum

  @Column()
  @IsNumber()
  amount: number

  @ManyToOne(() => CategoryEntity, (category) => category.records)
  category: CategoryEntity

  @ManyToOne(() => UserEntity, (user) => user.records)
  user: UserEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
