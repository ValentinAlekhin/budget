import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator'
import { UserEntity } from '@app/user/user.entity'
import { ApiProperty } from '@nestjs/swagger'
import { RecordEntity } from '@app/record/record.entity'

export enum CategoryTypeEnum {
  Dist = 'dist',
  Cost = 'cost',
}

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsString()
  @MinLength(4)
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
  type: 'dist' | 'cost'

  @Column({ default: '' })
  @IsString()
  comment: string

  @ManyToOne(() => UserEntity, (user) => user.categories)
  user: UserEntity

  @OneToMany(() => RecordEntity, (record) => record.category)
  records: RecordEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
