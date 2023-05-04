import { Column, Entity, OneToMany } from 'typeorm'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'
import { AbstractEntity } from 'src/common/abstract-entity'
import { CategoryEntity } from '../category/category.entity'
import { TokenEntity } from '../auth/token.entity'

@Entity('users')
export class UserEntity extends AbstractEntity {
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
  @MaxLength(50)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Пароль должен содержать заглвные и строчные буквы, а так же числа',
  })
  password: string

  @OneToMany(() => CategoryEntity, (category) => category.user)
  categories: CategoryEntity[]

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens: TokenEntity[]
}
