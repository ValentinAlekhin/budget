import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { UserEntity } from '@app/user/user.entity'
import { ApiProperty } from '@nestjs/swagger'
import { RecordEntity } from '@app/record/record.entity'
import { AbstractEntity } from '@app/common/abstract-entity'

export enum CategoryTypeEnum {
  Inc = 'inc',
  Cost = 'cost',
  Dist = 'dist',
}

@Entity('categories')
export class CategoryEntity extends AbstractEntity {
  @Column()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string

  @Column({
    type: 'enum',
    enum: CategoryTypeEnum,
  })
  @ApiProperty({
    enum: CategoryTypeEnum,
  })
  @IsEnum(CategoryTypeEnum)
  type: CategoryTypeEnum

  @Column()
  @IsNumber()
  order: number

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  comment: string | null

  @ManyToOne(() => UserEntity, (user) => user.categories, {
    onDelete: 'CASCADE',
  })
  user: UserEntity

  @OneToMany(() => RecordEntity, (record) => record.category)
  records: RecordEntity[]
}
