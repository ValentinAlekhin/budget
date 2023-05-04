import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm'
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { AbstractEntity } from '../common/abstract-entity'
import { CategoryEntity } from '../category/category.entity'

export enum CategoryTypeEnum {
  Inc = 'inc',
  Cost = 'cost',
  Dist = 'dist',
}

@Entity('records')
export class RecordEntity extends AbstractEntity {
  @Column()
  @IsEnum(CategoryTypeEnum)
  type: CategoryTypeEnum

  @Column()
  @IsNumber()
  amount: number

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  comment: string | null

  @ManyToOne(() => CategoryEntity, (category) => category.records, {
    onDelete: 'CASCADE',
  })
  category: CategoryEntity

  @Column('timestamp')
  @IsDateString()
  timestamp: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
