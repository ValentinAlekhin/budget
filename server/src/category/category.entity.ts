import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import {
  IsEnum,
  IsHexColor,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserEntity } from 'src/user/user.entity'
import { CategoryTypeEnum } from '@app/common/enum'
import { RecordEntity } from '../record/record.entity'
import { AbstractEntity } from '../common/abstract-entity'

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
  @IsNumber()
  @IsOptional()
  plan: number | null

  @Column({ nullable: true })
  @IsHexColor()
  @IsOptional()
  color: string | null

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  icon?: string | null

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  comment?: string | null

  @ManyToOne(() => UserEntity, (user) => user.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @Column()
  userId: string

  @OneToMany(() => RecordEntity, (record) => record.category, {
    onDelete: 'CASCADE',
  })
  records: RecordEntity[]
}
