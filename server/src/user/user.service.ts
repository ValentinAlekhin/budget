import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserEntity } from '@app/user/user.entity'
import { CreateUserDto } from '@app/user/dto/createUser.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { hash } from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'email'],
    })
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = new UserEntity()
    Object.assign(user, createUserDto)
    user.password = await hash(createUserDto.password, 10)

    try {
      const newUser = await this.userRepository.save(user)
      delete newUser.password

      return newUser
    } catch (e) {
      throw new HttpException(
        'Credentials already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }
  }
}
