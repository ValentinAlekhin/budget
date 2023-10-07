import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  UserEmailValidationRequestDto,
  UserUsernameValidationRequestDto,
  UserValidationResponseDto,
} from '@app/user/dto/filedValidations.dto'
import { CategoryService } from '@app/category/category.service'
import { hash } from '../common/utils/hash'
import { UserEntity } from './user.entity'
import { CreateUserDto } from './dto/createUser.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'password', 'email'],
    })

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    }

    return user
  }
  async findOneByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'email'],
    })
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = new UserEntity()
    Object.assign(user, createUserDto)
    user.password = await hash(createUserDto.password)

    try {
      const newUser = await this.userRepository.save(user)
      await this.categoryService.createAdjustment(newUser)
      delete newUser.password

      return newUser
    } catch (e) {
      throw new HttpException(
        'Пользователь с такими данными уже существует',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }
  }

  async validateEmail({
    email,
  }: UserEmailValidationRequestDto): Promise<UserValidationResponseDto> {
    const user = await this.userRepository.findOne({ where: { email } })

    return { valid: !user }
  }

  async validateUsername({
    username,
  }: UserUsernameValidationRequestDto): Promise<UserValidationResponseDto> {
    const user = await this.userRepository.findOne({ where: { username } })

    return { valid: !user }
  }
}
