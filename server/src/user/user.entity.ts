import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'
import { CategoryEntity } from '@app/category/category.entity'
import { RecordEntity } from '@app/record/record.entity'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Column({ select: false })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string

  @OneToMany(() => CategoryEntity, (category) => category.user)
  categories: CategoryEntity[]

  @OneToMany(() => RecordEntity, (record) => record.user)
  records: RecordEntity[]
}
