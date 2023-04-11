import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
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

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  comment: string

  @ManyToOne(() => CategoryEntity, (category) => category.records)
  category: CategoryEntity

  @ManyToOne(() => UserEntity, (user) => user.records)
  user: UserEntity

  @Column('timestamp')
  timestamp: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
