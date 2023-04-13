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
import { CategoryEntity, CategoryTypeEnum } from '@app/category/category.entity'
import { AbstractEntity } from '@app/common/abstract-entity'

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
