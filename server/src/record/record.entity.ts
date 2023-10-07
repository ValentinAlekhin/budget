import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
  AfterLoad,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm'
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator'
import { CategoryTypeEnum } from '@app/common/enum'
import { AbstractEntity } from '../common/abstract-entity'
import { CategoryEntity } from '../category/category.entity'

@Entity('records')
export class RecordEntity extends AbstractEntity {
  @Column()
  @IsNumber()
  amount: number

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  comment?: string | null

  @ManyToOne(() => CategoryEntity, (category) => category.records, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity

  @Column()
  categoryId: string

  @Column('timestamp')
  @IsDateString()
  timestamp: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  type: CategoryTypeEnum

  @AfterInsert()
  @AfterRemove()
  @AfterUpdate()
  @AfterLoad()
  private afterLoad() {
    this.type = this.category?.type
  }
}
